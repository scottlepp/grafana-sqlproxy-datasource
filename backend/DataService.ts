import { QueryDataRequest, DataService, DataFrame } from '@grafana/tsbackend';
import { DataQuery } from '@grafana/tsbackend/dist/proto/backend_pb';
import { load } from './sdk';

export class SqlProxyDataService extends DataService {

  async QueryData(request: QueryDataRequest): Promise<DataFrame[]> {
    const settings = request.getPlugincontext()?.getDatasourceinstancesettings();
    const url = settings?.getUrl();
    return this.fetchResults(url!, request.getQueriesList());
  }

  async fetchResults(url: string, queries: DataQuery[]) {
    const { fetchResults } = await load('./query');
    return fetchResults(url, queries);
  }

}
