/*jshint browser:true */

function lpad(s/*:string*/, len/*:number*/, chr/*:?string*/)/*:string*/{
	var L/*:number*/ = len - s.length, C/*:string*/ = chr || " ";
	if(L <= 0) return s;
	return new Array(L+1).join(C) + s;
}

function is_defined(val/*:any*/, keys/*:Array<string>*/)/*:boolean*/ {
	if(typeof val === "undefined") return false;
	return keys.length === 0 || is_defined(val[keys[0]], keys.slice(1));
}

/*## Process Result */
/*:: declare class HTMLPreElement extends HTMLElement { innerText?:string; } */
function process_value(val/*:CRC32Type*/, progress/*:number*/) {
	var output = [];
	output[0] = "Progress  : %" + lpad(progress.toFixed(2), 6, " ");
	output[1] = "Signed    : " + val;
	output[2] = "Unsigned  : " + (val>>>0);
	output[3] = "Hex value : " + lpad((val>>>0).toString(16),8,'0');

	var out/*:HTMLPreElement*/ = (document.getElementById('out')/*:any*/);
	var o = output.join("\n");
	if(typeof out.innerText == "undefined") out.textContent = o;
	else out.innerText = o;
}

/*::
type WMessage = {
	t:string;
	f:File;
	crc:CRC32Type;
	l:number;
	sz:number;
	bytes:number;
};
*/

/*# Drag and Drop File */
var handle_drop/*:EventHandler*/ = (function(e/*:DragEvent*/) {
	e.stopPropagation();
	e.preventDefault();
	if(!e.dataTransfer) return;
	var files/*:FileList*/ = e.dataTransfer.files;
	var f/*:File*/ = files[0];

	var worker = new Worker("demo/work.js");
	worker.postMessage(f);
	worker.onmessage = function(M) { var m/*:WMessage*/ = (M.data/*:any*/); switch(m.t) {
		case 'ready': break;
		case 'start': break;
		case 'data': process_value(m.crc, 100 * m.bytes / f.size); break;
		case 'done': break;
	} };
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
