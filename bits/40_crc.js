/* charCodeAt is the best approach for binary strings */
function crc32_bstr(bstr) {
	for(var crc = -1, i = 0, L=bstr.length-1; i < L;) {
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
		crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	}
	if(i === L) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i++)) & 0xFF];
	return crc ^ -1;
}

function crc32_buf(buf) {
	for(var crc = -1, i = 0; i != buf.length; ++i) {
		crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
	}
	return crc ^ -1;
}

/* much much faster to intertwine utf8 and crc */
function crc32_str(str) {
	for(var crc = -1, i = 0, L=str.length, c, d; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			crc = (crc >>> 8) ^ table[(crc ^ c) & 0xFF];
		} else if(c < 0x800) {
			crc = (crc >>> 8) ^ table[(crc ^ (192|((c>>6)&31))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++) & 1023;
			crc = (crc >>> 8) ^ table[(crc ^ (240|((c>>8)&7))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>2)&63))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((d>>6)&15)|(c&3))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(d&63))) & 0xFF];
		} else {
			crc = (crc >>> 8) ^ table[(crc ^ (224|((c>>12)&15))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>6)&63))) & 0xFF];
			crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
		}
	}
	return crc ^ -1;
}
