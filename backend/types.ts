import { DataQuery, DataSourceSettings } from '@grafana/data';

export interface SqlQuery extends DataQuery {
  sql: string;
}

export interface SqlOptions extends DataSourceSettings {}
