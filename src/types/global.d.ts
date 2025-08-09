// Global type declarations
declare global {
  namespace NodeJS {
    interface Timeout {
      _destroyed?: boolean;
      _idleTimeout?: number;
      _idlePrev?: any;
      _idleNext?: any;
      _idleStart?: number;
      _onTimeout?: (...args: any[]) => void;
      _timerArgs?: any[];
      _repeat?: number | null;
      _destroyed?: boolean;
      ref?(): this;
      unref?(): this;
      hasRef?(): boolean;
      refresh?(): this;
      [Symbol.toPrimitive]?(): number;
    }
  }
}

export {};
