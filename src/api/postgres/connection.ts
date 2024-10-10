export interface Connection {
  query(sql: QueryObject): Promise<QueryResult>;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): void;
}

export class QueryResult {
  public records: unknown[];
  public numberOfRecordsUpdated?: number;

  constructor(records: unknown[], numberOfRecordsUpdated?: number) {
    this.records = records;
    this.numberOfRecordsUpdated = numberOfRecordsUpdated;
  }
}

export interface QueryObject {
  sql: string;
  parameters?: unknown;
  database?: string;
}

export default Connection;
