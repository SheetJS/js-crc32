/*::
type _CB = {(data:Buffer):void;};
declare module 'concat-stream' {declare function exports(f:_CB):stream$Duplex;};
declare module 'exit-on-epipe' {};

declare module 'crc-32' { declare module.exports:CRC32Module;  };
declare module '../' { declare module.exports:CRC32Module; };

declare module 'printj' {
  declare function sprintf(fmt:string, ...args:any):string;
};
*/
