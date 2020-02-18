import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps, DataSourceJsonData } from '@grafana/data';

interface Props extends DataSourcePluginOptionsEditorProps<DataSourceJsonData> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {

  render() {
    const { options, onOptionsChange } = this.props;

    return (
      <div className="gf-form-group">
        <DataSourceHttpSettings defaultUrl="" dataSourceConfig={options} onChange={onOptionsChange} showAccessOptions={false} />
      </div>
    );
  }
}
