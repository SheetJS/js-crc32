/* crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported CRC32 */
/*:: declare var DO_NOT_EXPORT_CRC:?boolean; */
/*:: declare function define(cb:()=>any):void; */
var CRC32/*:CRC32Module*/;
(function (factory/*:(a:any)=>void*/)/*:void*/ {
	/*jshint ignore:start */
	/*eslint-disable */
	if(typeof DO_NOT_EXPORT_CRC === 'undefined') {
		if('object' === typeof exports) {
			factory(exports);
		} else if ('function' === typeof define && define.amd) {
			define(function () {
				var module/*:CRC32Module*/ = /*::(*/{}/*:: :any)*/;
				factory(module);
				return module;
			});
		} else {
			factory(CRC32 = /*::(*/{}/*:: :any)*/);
		}
	} else {
		factory(CRC32 = /*::(*/{}/*:: :any)*/);
	}
	/*eslint-enable */
	/*jshint ignore:end */
}(function(CRC32/*:CRC32Module*/) {
