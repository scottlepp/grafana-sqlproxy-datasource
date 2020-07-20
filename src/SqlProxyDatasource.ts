import _ from 'lodash';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  DataSourceJsonData,
  MutableDataFrame,
  DataFrame,
  guessFieldTypeFromValue,
} from '@grafana/data';

import { SqlQuery } from './types';
import { getBackendSrv } from '@grafana/runtime';

export class DataSource extends DataSourceApi<SqlQuery, DataSourceJsonData> {
  /** @ngInject */
  constructor(private instanceSettings: DataSourceInstanceSettings<DataSourceJsonData>, public templateSrv: any) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<SqlQuery>): Promise<DataQueryResponse> {
    const { range } = options;

    if (!range) {
      return { data: [] };
    }
    options.startTime = range.from.valueOf();
    options.endTime = range.to.valueOf();

    const baseUrl = this.instanceSettings.url!;
    const route = baseUrl.endsWith('/') ? 'query?' : '/query?';

    const opts = this.interpolate(options);

    const calls = opts.targets.map(target => {
      const url = `${baseUrl}${route}sql=${target.sql}`;
      return getBackendSrv()
        .datasourceRequest({ url })
        .then(res => {
          return this.arrayToDataFrame(res.data);
        });
    });

    const data = await Promise.all(calls);

    return {
      data,
    };
  }

  arrayToDataFrame(array: any[]): DataFrame {
    let dataFrame: MutableDataFrame = new MutableDataFrame();
    if (array.length > 0) {
      const fields = Object.keys(array[0]).map(field => {
        return { name: field, type: guessFieldTypeFromValue(array[0][field]) };
      });
      dataFrame = new MutableDataFrame({ fields });
      array.forEach((row, index) => {
        dataFrame.appendRow(Object.values(row));
      });
    }
    return dataFrame;
  }

  interpolate(options: DataQueryRequest<SqlQuery>): DataQueryRequest<SqlQuery> {
    const visibleTargets: SqlQuery[] = options.targets.filter((target: SqlQuery) => !target.hide);
    return {
      ...options,
      targets: visibleTargets.map(target => {
        const query: SqlQuery = {
          ...target,
          sql: this.templateSrv.replace(target.sql),
        };
        return query;
      }),
    };
  }

  metricFindQuery(query: any) {
    console.log('query', query);
    return Promise.resolve([]);
  }

  async testDatasource() {
    const url = this.instanceSettings.url!;
    const response = await getBackendSrv().post(url, this.instanceSettings.jsonData);
    return {
      status: 'success',
      message: response.data,
      title: 'Success',
    };
  }
}
