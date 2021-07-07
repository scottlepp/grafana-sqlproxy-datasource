import { BackendServer } from '@grafana/tsbackend';
import { SqlProxyDiagnosticsService } from './DiagnosticsService';
import { SqlProxyDataService } from './DataService';

const server = new BackendServer();
server.addDiagnosticsService(new SqlProxyDiagnosticsService());
server.addDataService(new SqlProxyDataService());

export default server;