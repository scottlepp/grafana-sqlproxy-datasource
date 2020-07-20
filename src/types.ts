import { DataQuery } from '@grafana/data';

export interface SqlQuery extends DataQuery {
  sql: string;
}
