import { QueryDataRequest, DataService, DataFrame } from '@grafana/tsbackend';
import { SqlQuery } from '../shared/types';
import { DataQuery } from '@grafana/tsbackend/dist/proto/backend_pb';
import { ArrayDataFrame } from '@grafana/data';
import { doGet } from './http';

export class SqlProxyDataService extends DataService {

  async QueryData(request: QueryDataRequest): Promise<DataFrame[]> {
    const settings = request.getPlugincontext()?.getDatasourceinstancesettings();
    const url = settings?.getUrl();
    const results = await this.fetchResults(url!, request.getQueriesList());
    return Promise.resolve(results);
  }

  async fetchResults(url: string, queries: DataQuery[]) {
    const results = queries.map(q => {
      return doGet(`${url}/query?sql=${this.getQuery(q).sql}`);
    });
    const all = await Promise.all(results);
    return all.map(r => this.arrayToDataFrame(r as unknown as Array<any>));
  }

  arrayToDataFrame(array: any[]): DataFrame {
    return new ArrayDataFrame(array) as unknown as DataFrame;
  }

  getQuery(q: DataQuery): SqlQuery {
    const json = q.getJson();
    const jsonString: string = Buffer.from(json as string, 'base64').toString('ascii');
    return JSON.parse(jsonString);
  }
}
