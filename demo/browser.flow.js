/*jshint browser:true */
/*eslint-env browser */
/*global CRC32, console, Uint8Array */
/*:: declare var CRC32: CRC32Module; */
var X = CRC32;

function console_log(/*:: ...args:Array<any> */) { if(typeof console !== 'undefined') console.log.apply(console, [].slice.call(arguments)); }

function lpad(s/*:string*/, len/*:number*/, chr/*:?string*/)/*:string*/{
	var L/*:number*/ = len - s.length, C/*:string*/ = chr || " ";
	if(L <= 0) return s;
	return new Array(L+1).join(C) + s;
}

function is_defined(val/*:any*/, keys/*:Array<string>*/)/*:boolean*/ {
	if(typeof val === "undefined") return false;
	return keys.length === 0 || is_defined(val[keys[0]], keys.slice(1));
}

/*# buffer to string; IE String.fromCharCode.apply limit, manual chunk */
/*::
type ArrayLike = any;
type Stringifier = {(d:ArrayLike):string};
*/
function make_chunk_buf_to_str(BType/*:function*/)/*:Stringifier*/ {
	return function(data/*:any*/)/*:string*/ {
		var o = "", l = 0, w = 10240, L = data.byteLength/w;
		for(; l<L; ++l) o+=String.fromCharCode.apply(null, ((new BType(data.slice(l*w,l*w+w)))/*:any*/));
		o+=String.fromCharCode.apply(null, ((new BType(data.slice(l*w)))/*:any*/));
		return o;
	};
}
/*# buffer to binary string */
var bstrify/*:Stringifier*/ = make_chunk_buf_to_str(typeof Uint8Array !== 'undefined' ? Uint8Array : Array);

/*# readAsBinaryString support */
var rABS/*:boolean*/ = typeof FileReader !== 'undefined' && is_defined(FileReader, ['prototype', 'readAsBinaryString']);
var userABS/*:HTMLInputElement*/ = (document.getElementsByName("userabs")[0]/*:any*/);
if(!rABS) {
	userABS.disabled = true;
	userABS.checked = false;
}

/*## Process Result */
/*:: declare class HTMLPreElement extends HTMLElement { innerText?:string; } */
function process_value(val/*:CRC32Type*/) {
	var output = [];
	output[0] = "Signed    : " + val;
	output[1] = "Unsigned  : " + (val>>>0);
	output[2] = "Hex value : " + lpad((val>>>0).toString(16),8,'0');

	var out/*:HTMLPreElement*/ = (document.getElementById('out')/*:any*/);
	var o = output.join("\n");
	if(typeof out.innerText == "undefined") out.textContent = o;
	else out.innerText = o;
	console_log("output", new Date());
}

/*## Raw Text */
var dotxt/*:HTMLInputElement*/ = (document.getElementById('dotext')/*:any*/);
dotxt.onclick = function() {
	var txt/*:HTMLTextAreaElement*/=(document.getElementById('rawdata')/*:any*/);
	console_log("onload", new Date());
	var wb/*:CRC32Type*/ = X.str(txt.value);
	process_value(wb);
};

/*# HTML5 */

var readcb = function(e/*:Event*/) {
	console_log("onload", new Date(), rABS, false);
	var target/*:FileReader*/ = (e.target/*:any*/);
	var data = target.result;
	var val/*:CRC32Type*/ = rABS ? X.bstr(/*::(*/data/*:: :any)*/) : X.str(bstrify(data));
	process_value(val);
};

/*## File Input */
var handle_file = function(e/*:Event*/) {
	rABS = userABS.checked;
	var otarget/*:HTMLInputElement*/ = (e.target/*:any*/);
	var files/*:FileList*/ = otarget.files;
	var f/*:File*/ = files[0];

	var reader/*:FileReader*/ = new FileReader();
	reader.onload = readcb;

	if(rABS) (reader/*:any*/).readAsBinaryString(f);
	else reader.readAsArrayBuffer(f);
};

var xlf/*:HTMLInputElement*/ = (document.getElementById('xlf')/*:any*/);
if(xlf.addEventListener) xlf.addEventListener('change', handle_file, false);

/*## Drag and Drop File */
var handle_drop/*:EventHandler*/ = (function(e/*:DragEvent*/) {
	e.stopPropagation();
	e.preventDefault();
	rABS = userABS.checked;
	if(!e.dataTransfer) return;
	var files/*:FileList*/ = e.dataTransfer.files;
	var f/*:File*/ = files[0];

	var reader/*:FileReader*/ = new FileReader();
	reader.onload = readcb;

	if(rABS) (reader/*:any*/).readAsBinaryString(f);
	else reader.readAsArrayBuffer(f);
}/*:any*/);

var handle_drag/*:EventHandler*/ = (function (e/*:DragEvent*/) {
	e.stopPropagation();
	e.preventDefault();
	if(e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
}/*:any*/);

var drop/*:HTMLDivElement*/ = (document.getElementById('drop')/*:any*/);
if(drop.addEventListener) {
	drop.addEventListener('dragenter', handle_drag, false);
	drop.addEventListener('dragover',  handle_drag, false);
	drop.addEventListener('drop',      handle_drop, false);
}
