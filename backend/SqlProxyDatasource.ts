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
  FieldType,
} from '@grafana/data';

import { SqlQuery } from './types';
import { getBackendSrv } from '@grafana/runtime';
import { format } from 'date-fns';

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
      for (const field of fields) {
        if (field.name.toLowerCase() === 'time') {
          field.type = FieldType.time;
        }
      }
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
          sql: this.applyMacros(this.templateSrv.replace(target.sql, options.scopedVars), options),
        };
        return query;
      }),
    };
  }

  applyMacros(sql: string, options: DataQueryRequest<SqlQuery>) {
    if (sql.includes('$__timeFrom(')) {
      sql = this.applyMacroFunction('$__timeFrom(', sql, options);
    }
    if (sql.includes('$__timeTo(')) {
      sql = this.applyMacroFunction('$__timeTo(', sql, options);
    }
    if (sql.includes('$__timeFrom')) {
      sql = sql.replace(/\$__timeFrom/g, options.startTime.toString());
    }
    if (sql.includes('$__timeTo')) {
      sql = sql.replace(/\$__timeTo/g, options.endTime?.toString() ?? '');
    }
    return sql;
  }

  applyMacroFunction(macro: string, sql: string, options: DataQueryRequest<SqlQuery>): string {
    if (sql.includes(macro)) {
      let time;
      if (macro === '$__timeFrom(') {
        time = new Date(options.startTime);
      } else {
        time = new Date(options.endTime!);
      }

      const start = sql.indexOf(macro) + macro.length;
      const end = sql.indexOf(')', start);
      const fmt = sql.substring(start, end);
      const dateStr = format(time, fmt);
      const toReplace = sql.substring(start - macro.length, end + 1);
      sql = sql.replace(toReplace, dateStr);
      return this.applyMacroFunction(macro, sql, options);
    }
    return sql;
  }

  metricFindQuery(query: any) {
    const baseUrl = this.instanceSettings.url!;
    const route = baseUrl.endsWith('/') ? 'query?' : '/query?';
    const url = `${baseUrl}${route}sql=${query}`;
    return getBackendSrv()
      .datasourceRequest({ url })
      .then(res => {
        return res.data.map((v: any) => ({ text: Object.values(v) }));
      });
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
