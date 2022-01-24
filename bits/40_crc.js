/*# charCodeAt is the best approach for binary strings */
function crc32_bstr(bstr/*:string*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	if(bstr.length > 10000) return crc32_bstr_16(bstr, seed);
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = bstr.length - 1;
	for(var i = 0; i < L;) {
		C = (C>>>8) ^ T[(C^bstr.charCodeAt(i++))&0xFF];
		C = (C>>>8) ^ T[(C^bstr.charCodeAt(i++))&0xFF];
	}
	if(i === L) C = (C>>>8) ^ T[(C ^ bstr.charCodeAt(i))&0xFF];
	return C ^ -1;
}
function crc32_bstr_16(bstr/*:string*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = bstr.length - 15;
	for(var i = 0; i < L;) C =
		Tf[bstr.charCodeAt(i++) ^ (C & 255)] ^
		Te[bstr.charCodeAt(i++) ^ ((C >> 8) & 255)] ^
		Td[bstr.charCodeAt(i++) ^ ((C >> 16) & 255)] ^
		Tc[bstr.charCodeAt(i++) ^ (C >>> 24)] ^
		Tb[bstr.charCodeAt(i++)] ^
		Ta[bstr.charCodeAt(i++)] ^
		T9[bstr.charCodeAt(i++)] ^
		T8[bstr.charCodeAt(i++)] ^
		T7[bstr.charCodeAt(i++)] ^
		T6[bstr.charCodeAt(i++)] ^
		T5[bstr.charCodeAt(i++)] ^
		T4[bstr.charCodeAt(i++)] ^
		T3[bstr.charCodeAt(i++)] ^
		T2[bstr.charCodeAt(i++)] ^
		T1[bstr.charCodeAt(i++)] ^
		T[bstr.charCodeAt(i++)];
	L += 15;
	while(i < L) C = (C>>>8) ^ T[(C^bstr.charCodeAt(i++))&0xFF];
	return C ^ -1;
}

function crc32_buf(buf/*:ABuf*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	if(buf.length > 2000) return crc32_buf_16(buf, seed);
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = buf.length - 3;
	for(var i = 0; i < L;) {
		C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
		C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
		C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
		C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
	}
	while(i < L+3) C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
	return C ^ -1;
}
function crc32_buf_16(buf/*:ABuf*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = buf.length - 15;
	for(var i = 0; i < L;) C =
		Tf[buf[i++] ^ (C & 255)] ^
		Te[buf[i++] ^ ((C >> 8) & 255)] ^
		Td[buf[i++] ^ ((C >> 16) & 255)] ^
		Tc[buf[i++] ^ (C >>> 24)] ^
		Tb[buf[i++]] ^
		Ta[buf[i++]] ^
		T9[buf[i++]] ^
		T8[buf[i++]] ^
		T7[buf[i++]] ^
		T6[buf[i++]] ^
		T5[buf[i++]] ^
		T4[buf[i++]] ^
		T3[buf[i++]] ^
		T2[buf[i++]] ^
		T1[buf[i++]] ^
		T[buf[i++]];
	L += 15;
	while(i < L) C = (C>>>8) ^ T[(C^buf[i++])&0xFF];
	return C ^ -1;
}


/*# much much faster to intertwine utf8 and crc, slower to slice by 8 or 16 */
function crc32_str(str/*:string*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1;
	for(var i = 0, L = str.length, c = 0, d = 0; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			C = (C>>>8) ^ T[(C ^ c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return C ^ -1;
}
