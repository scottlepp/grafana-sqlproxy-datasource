import { logger as log, BackendSrvImpl, CheckHealthRequest, CheckHealthResponse, DiagnosticsService, CollectMetricsRequest, CollectMetricsResponse } from '@grafana/tsbackend';

export class SqlProxyDiagnosticsService extends DiagnosticsService {
  CheckHealth = async (request: CheckHealthRequest): Promise<CheckHealthResponse> => {
    log.debug("We got a check health request", request.toObject().plugincontext?.datasourceinstancesettings);
    const instanceSettings = request.toObject().plugincontext?.datasourceinstancesettings;
    const response: CheckHealthResponse = new CheckHealthResponse();

    if (instanceSettings) {
      const { jsondata, url } = instanceSettings;
      const backendSrv = new BackendSrvImpl(instanceSettings);
      const innerResponse = await backendSrv.post(url, jsondata);
      response.setStatus(CheckHealthResponse.HealthStatus.OK)
      response.setMessage(innerResponse.data); 
    } else {
      response.setStatus(CheckHealthResponse.HealthStatus.ERROR);
      response.setMessage("Please configure the datasource first");
    }

    return Promise.resolve(response);
  }
  CollectMetrics = (request: CollectMetricsRequest): Promise<CollectMetricsResponse> => {
    throw new Error("Method not implemented.");
  }
}