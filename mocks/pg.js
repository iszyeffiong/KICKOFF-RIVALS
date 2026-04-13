// Mock for 'pg' module to prevent hydration issues in browser
// This provides a no-op client/pool for the frontend
export class Pool {
  constructor() {
    this.on = () => this;
    this.connect = () => Promise.resolve({ release: () => {} });
    this.query = () => Promise.resolve({ rows: [] });
    this.end = () => Promise.resolve();
  }
}

export const Client = class {
  constructor() {
    this.connect = () => Promise.resolve();
    this.query = () => Promise.resolve({ rows: [] });
    this.end = () => Promise.resolve();
  }
};

export default {
  Pool,
  Client
};
