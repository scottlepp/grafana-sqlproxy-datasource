import { logger as log, CheckHealthRequest, CheckHealthResponse, DiagnosticsService, CollectMetricsRequest, CollectMetricsResponse } from '@grafana/tsbackend';
import { SqlOptions } from './types';
import fetch from 'node-fetch';

export class SqlProxyDiagnosticsService extends DiagnosticsService {
  CheckHealth = async (request: CheckHealthRequest): Promise<CheckHealthResponse> => {
    const requestObj: CheckHealthRequest.AsObject = request.toObject();
    const instanceSettings = requestObj.plugincontext?.datasourceinstancesettings;
    const response: CheckHealthResponse = new CheckHealthResponse();

    log.debug("We got a check health request", instanceSettings);
    if (instanceSettings) {
      const { jsondata } = instanceSettings;
      const json: SqlOptions = JSON.parse(Buffer.from(jsondata as string, 'base64').toString('ascii'));
      log.debug("We have jsondata", json.url, json);
      const innerResponse = await fetch(json.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      response.setStatus(CheckHealthResponse.HealthStatus.OK)
      response.setMessage(JSON.stringify(innerResponse)); 
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