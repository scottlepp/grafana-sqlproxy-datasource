import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { SqlQuery, Settings } from '../shared/types';
import { DataSource } from './Datasource';

export const plugin = new DataSourcePlugin<DataSource, SqlQuery, Settings>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
