import { DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';
import { SqlOptions, SqlQuery } from './types';

export class DataSource extends DataSourceWithBackend<SqlQuery, SqlOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<SqlOptions>) {
    super(instanceSettings);
  }
}
