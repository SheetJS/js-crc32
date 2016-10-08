/*::
type _CB = {(data:Buffer):void;};
declare module 'concat-stream' {declare function exports(f:_CB):stream$Duplex;};
declare module 'exit-on-epipe' {};

declare module 'crc-32' { declare var exports:CRC32Module;  };
declare module '../' { declare var exports:CRC32Module; };

declare module 'printj' {
  declare function sprintf(fmt:string, ...args:any):string;
};
*/
