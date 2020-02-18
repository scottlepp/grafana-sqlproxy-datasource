import { DataSourcePlugin, DataSourceJsonData } from '@grafana/data';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { SqlQuery } from './types';
import { DataSource } from './SqlProxyDatasource';

export const plugin = new DataSourcePlugin<DataSource, SqlQuery, DataSourceJsonData>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
