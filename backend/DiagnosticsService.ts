import { CheckHealthRequest, CheckHealthResponse, DiagnosticsService, CollectMetricsRequest, CollectMetricsResponse } from '@grafana/tsbackend';
import { doPost } from './sdk';

export class SqlProxyDiagnosticsService extends DiagnosticsService {

  CheckHealth = async (request: CheckHealthRequest): Promise<CheckHealthResponse> => {
    const settings = request.toObject().plugincontext?.datasourceinstancesettings;
    const health: CheckHealthResponse = new CheckHealthResponse();
    if (settings) {
      const jsonString: string = Buffer.from(settings.jsondata as string, 'base64').toString('ascii');
      const status = await doPost(settings.url, jsonString);
      health.setStatus(CheckHealthResponse.HealthStatus.OK)
      health.setMessage(`Connected Successfully ${JSON.stringify(status)}`); 
    } else {
      health.setStatus(CheckHealthResponse.HealthStatus.ERROR);
      health.setMessage("Please configure the datasource first");
    }
    return health;
  }

  CollectMetrics = (request: CollectMetricsRequest): Promise<CollectMetricsResponse> => {
    throw new Error("Method not implemented.");
  }
}
