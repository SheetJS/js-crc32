function crc32_bstr(bstr/*:string*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1;
	for(var i = 0, L = bstr.length; i < L;) C = (C>>>8) ^ T0[(C^bstr.charCodeAt(i++))&0xFF];
	return ~C;
}

function crc32_buf(B/*:ABuf*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = B.length - 15, i = 0;
	for(; i < L;) C =
		Tf[B[i++] ^ (C & 255)] ^
		Te[B[i++] ^ ((C >> 8) & 255)] ^
		Td[B[i++] ^ ((C >> 16) & 255)] ^
		Tc[B[i++] ^ (C >>> 24)] ^
		Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
		T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
		T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
	L += 15;
	while(i < L) C = (C>>>8) ^ T0[(C^B[i++])&0xFF];
	return ~C;
}

function crc32_str(str/*:string*/, seed/*:?CRC32Type*/)/*:CRC32Type*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1;
	for(var i = 0, L = str.length, c = 0, d = 0; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			C = (C>>>8) ^ T0[(C^c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T0[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T0[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T0[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return ~C;
}
