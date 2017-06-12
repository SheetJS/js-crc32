/* js-crc32 (C) 2014-present  SheetJS -- http://sheetjs.com */
/*:: declare var CRC32: CRC32Module; */
/*:: declare var self: DedicatedWorkerGlobalScope; */
importScripts('../crc32.js');
/*::self.*/postMessage({t:"ready"});

var recrc = function(f, crc, l) {
	/*::self.*/postMessage({t:"iter", f:f, crc:crc, l:l, sz:f.size});
	if(l >= f.size) return /*::self.*/postMessage({t:"done"});
	var sz = 0x100000; if(l + sz > f.size) sz = f.size - l;
	var d = f.slice(l, l + sz);
	var r = new FileReader();
	r.onload = function(e) {
		var b = new Uint8Array(e.target.result);
		var newcrc = CRC32.buf(b, crc);
		/*::self.*/postMessage({t:"data", crc:newcrc, bytes:l+sz});
		recrc(f, newcrc, l + sz);
	};
	r.readAsArrayBuffer(d);
};

onmessage = function (oEvent) {
	/*::self.*/postMessage({t:"start"});
	var f/*:File*/ = oEvent.data;
  var seed = 0;
	recrc(f, seed, 0);
};

