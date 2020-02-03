declare module 'enquire-js' {
  function enquireScreen(
    cb: Function | null,
    query: string | undefined
  ): object;
  function unenquireScreen(
    hander: object | null,
    query: string | undefined
  ): void;
}
