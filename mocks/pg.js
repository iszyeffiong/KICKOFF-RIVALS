// Client-side mock for 'pg' module to prevent hydration issues in browser.
// The real pg module is Node-only and must never reach the browser bundle.
// Server functions handle the logic split, but the static imports still 
// exist in the codebase, so we alias them to this harmless mock for Vite.

export class Pool {
  constructor() {
    this.on = () => this;
    this.connect = () => Promise.resolve({ release: () => {} });
    this.query = () => Promise.resolve({ rows: [] });
    this.end = () => Promise.resolve();
  }
}

export class Client {
  constructor() {
    this.connect = () => Promise.resolve();
    this.query = () => Promise.resolve({ rows: [] });
    this.end = () => Promise.resolve();
    this.on = () => this;
  }
}

export const types = {
  setTypeParser: () => {},
  getTypeParser: () => {},
};

export const defaults = {};

export default { 
  Pool, 
  Client, 
  types, 
  defaults 
};
