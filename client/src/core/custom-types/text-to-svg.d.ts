declare module 'text-to-svg' {
  export function load(fontPath: string, cb: (e: Error, t2s: T2S) => void);

  export type T2S = {
    getPath: (text: string, options: GetPathOptions) => string;
  };

  export type GetPathOptions = { x: number; y: number; fontSize: number; attributes: Attributes };

  export type Attributes = {
    [key: string]: string;
  };
}
