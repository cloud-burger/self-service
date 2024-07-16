export interface Connection {
  query(sql: QueryObject): Promise<QueryResult>;
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
