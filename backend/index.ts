import { BackendServer } from '@grafana/tsbackend';
import { GithubDiagnosticsService } from './DiagnosticsService';
import { GithubDataService } from './DataService';

const app = new BackendServer();
app.addDiagnosticsService(new GithubDiagnosticsService());
app.addDataService(new GithubDataService());

module.exports = app;