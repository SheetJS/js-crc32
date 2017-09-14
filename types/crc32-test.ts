import { buf, bstr, str } from 'crc-32';

const t1: number = buf([1,2,3,4,5]);
const t3: number = bstr("\u0001\u0002\u0003\u0004\u0005");
const t5: number = str("\u0001\u0002\u0003\u0004\u0005");

const t2: number = buf(new Uint8Array([1,2,3,4,5]), t3);
const t4: number = bstr("\u0001\u0002\u0003\u0004\u0005", t5);
const t6: number = str("\u0001\u0002\u0003\u0004\u0005", t1);
