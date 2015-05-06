/* crc32.js (C) 2014-2015 SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
var CRC32;
/*:: declare var DO_NOT_EXPORT_CRC: any; */
/*:: declare var define: any; */
(function (factory) {
	if(typeof DO_NOT_EXPORT_CRC === 'undefined') {
		if('object' === typeof exports) {
			factory(exports);
		} else if ('function' === typeof define && define.amd) {
			define(function () {
				var module = {};
				factory(module);
				return module;
			});
		} else {
		  factory(CRC32 = {});
		}
	} else {
		factory(CRC32 = {});
	}
}(function(CRC32) {
