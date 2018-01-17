/*jshint browser:true */
/*eslint-env browser */
/*global CRC32, console, Uint8Array */
var X = CRC32;

function console_log() { if(typeof console !== 'undefined') console.log.apply(console, [].slice.call(arguments)); }

function lpad(s, len, chr){
	var L = len - s.length, C = chr || " ";
	if(L <= 0) return s;
	return new Array(L+1).join(C) + s;
}

function is_defined(val, keys) {
	if(typeof val === "undefined") return false;
	return keys.length === 0 || is_defined(val[keys[0]], keys.slice(1));
}

function make_chunk_buf_to_str(BType) {
	return function(data) {
		var o = "", l = 0, w = 10240, L = data.byteLength/w;
		for(; l<L; ++l) o+=String.fromCharCode.apply(null, ((new BType(data.slice(l*w,l*w+w)))));
		o+=String.fromCharCode.apply(null, ((new BType(data.slice(l*w)))));
		return o;
	};
}
var bstrify = make_chunk_buf_to_str(typeof Uint8Array !== 'undefined' ? Uint8Array : Array);

var rABS = typeof FileReader !== 'undefined' && is_defined(FileReader, ['prototype', 'readAsBinaryString']);
var userABS = (document.getElementsByName("userabs")[0]);
if(!rABS) {
	userABS.disabled = true;
	userABS.checked = false;
}

function process_value(val) {
	var output = [];
	output[0] = "Signed    : " + val;
	output[1] = "Unsigned  : " + (val>>>0);
	output[2] = "Hex value : " + lpad((val>>>0).toString(16),8,'0');

	var out = (document.getElementById('out'));
	var o = output.join("\n");
	if(typeof out.innerText == "undefined") out.textContent = o;
	else out.innerText = o;
	console_log("output", new Date());
}

var dotxt = (document.getElementById('dotext'));
dotxt.onclick = function() {
	var txt=(document.getElementById('rawdata'));
	console_log("onload", new Date());
	var wb = X.str(txt.value);
	process_value(wb);
};

var readcb = function(e) {
	console_log("onload", new Date(), rABS, false);
	var target = (e.target);
	var data = target.result;
	var val = rABS ? X.bstr(data) : X.str(bstrify(data));
	process_value(val);
};

var handle_file = function(e) {
	rABS = userABS.checked;
	var otarget = (e.target);
	var files = otarget.files;
	var f = files[0];

	var reader = new FileReader();
	reader.onload = readcb;

	if(rABS) (reader).readAsBinaryString(f);
	else reader.readAsArrayBuffer(f);
};

var xlf = (document.getElementById('xlf'));
if(xlf.addEventListener) xlf.addEventListener('change', handle_file, false);

var handle_drop = (function(e) {
	e.stopPropagation();
	e.preventDefault();
	rABS = userABS.checked;
	if(!e.dataTransfer) return;
	var files = e.dataTransfer.files;
	var f = files[0];

	var reader = new FileReader();
	reader.onload = readcb;

	if(rABS) (reader).readAsBinaryString(f);
	else reader.readAsArrayBuffer(f);
});

var handle_drag = (function (e) {
	e.stopPropagation();
	e.preventDefault();
	if(e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
});

var drop = (document.getElementById('drop'));
if(drop.addEventListener) {
	drop.addEventListener('dragenter', handle_drag, false);
	drop.addEventListener('dragover',  handle_drag, false);
	drop.addEventListener('drop',      handle_drop, false);
}
