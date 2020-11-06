import { DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';
import { Settings, SqlQuery } from './types';

export class DataSource extends DataSourceWithBackend<SqlQuery, Settings> {
  constructor(instanceSettings: DataSourceInstanceSettings<Settings>) {
    super(instanceSettings);
  }
}
