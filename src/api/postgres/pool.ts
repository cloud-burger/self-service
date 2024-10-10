import Connection from './connection';

export interface Pool {
  getConnection(): Promise<Connection>;
}

export default Pool;
