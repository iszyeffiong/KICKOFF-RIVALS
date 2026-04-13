// Client-side mock for 'pg' module.
// The real pg module is Node-only and must never reach the browser bundle.
// Server functions (createServerFn) handle the split automatically,
// but the static import still gets resolved by Vite for the client.

export class Pool {
  constructor() {}
  connect() { return Promise.resolve(); }
  query() { return Promise.resolve({ rows: [] }); }
  end() { return Promise.resolve(); }
  on() {}
}

export class Client {
  constructor() {}
  connect() { return Promise.resolve(); }
  query() { return Promise.resolve({ rows: [] }); }
  end() { return Promise.resolve(); }
  on() {}
}

export const types = {};
export const defaults = {};

export default { Pool, Client, types, defaults };
