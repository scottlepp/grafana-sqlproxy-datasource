import { BackendServer } from '@grafana/tsbackend';
import { SqlProxyDiagnosticsService } from './DiagnosticsService';
import { SqlProxyDataService } from './DataService';

const app = new BackendServer();
app.addDiagnosticsService(new SqlProxyDiagnosticsService());
app.addDataService(new SqlProxyDataService());

module.exports = app;