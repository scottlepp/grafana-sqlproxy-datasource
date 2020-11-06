import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { SqlQuery, SqlOptions } from './types';
import { DataSource } from './Datasource';

export const plugin = new DataSourcePlugin<DataSource, SqlQuery, SqlOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
