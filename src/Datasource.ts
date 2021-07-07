import { DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';
import { Settings, SqlQuery } from '../shared/types';

// TODO - migrate template variables and macros from SqlProxyDatasource.ts
export class DataSource extends DataSourceWithBackend<SqlQuery, Settings> {
  constructor(instanceSettings: DataSourceInstanceSettings<Settings>) {
    super(instanceSettings);
  }
}
