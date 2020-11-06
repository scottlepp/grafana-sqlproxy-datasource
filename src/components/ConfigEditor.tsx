import React, { PureComponent } from 'react';
import { Input, LegacyForms } from '@grafana/ui';
const { FormField } = LegacyForms;

import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { css, cx } from 'emotion';
import { ProxySettings } from 'types';

export type Props = DataSourcePluginOptionsEditorProps<ProxySettings>;

export class ConfigEditor extends PureComponent<Props, ProxySettings> {
  isValidUrl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(
    this.props.options.url
  );

  notValidStyle = css`
    box-shadow: inset 0 0px 5px red;
  `;

  inputStyle = cx({ [`width-10`]: true });
  urlStyle = cx({ [`width-20`]: true, [this.notValidStyle]: !this.isValidUrl });
  fullStyle = cx({ [`width-20`]: true });

  inputs = [
    { key: 'url', placeholder: 'http://localhost:8080', style: this.urlStyle, type: 'text' },
    { key: 'host', placeholder: 'host[:port]', style: this.fullStyle, type: 'text' },
    { key: 'type', placeholder: 'Database Type', style: this.fullStyle, type: 'text' },
    { key: 'database', placeholder: 'Database Name', style: this.fullStyle, type: 'text' },
    { key: 'username', placeholder: 'User Name', style: this.inputStyle, type: 'test' },
    { key: 'password', placeholder: 'User Password', style: this.inputStyle, type: 'password' },
  ];

  componentWillMount() {
    this.setState(this.props.options.jsonData);
  }

  onChange(option: ProxySettings) {
    const state = this.state;
    const settings = { ...state, ...option };

    const { onOptionsChange, options } = this.props;
    const opt = { ...options, url: option.url || options.url };
    onOptionsChange({
      ...opt,
      jsonData: settings,
    });

    this.setState(settings);
  }

  onToggleChange = (opt) => {
    const on = opt.target.value === 'on';
    this.onChange( { backend: on } as ProxySettings);
  }

  getElement(input) {
    return (
      <Input
        type={input.type}
        css={input.css}
        className={input.style}
        placeholder={input.placeholder}
        value={this.state[input.key]}
        autoComplete={'new-password'}
        onChange={event => this.onChange(({ [input.key]: event.currentTarget.value } as unknown) as ProxySettings)}
      />
    );
  }

  render() {
    const get = (name: string) => {
      const input = this.inputs.find(input => input.key === name);
      return this.getElement(input);
    };

    return (
      <div className="gf-form-group">
        <h3 className="page-heading">SQL Proxy</h3>
        <div className="gf-form-group">
          <div className="gf-form">
            <FormField label="URL" inputWidth={30} labelWidth={10} tooltip={'SQL Proxy URL'} inputEl={get('url')} />
          </div>
        </div>

        <h3 className="page-heading">Database Connection</h3>
        <div className="gf-form-group">
          <div className="gf-form">
            <FormField label="Host" inputWidth={30} labelWidth={10} tooltip={'Database Host'} inputEl={get('host')} />
          </div>
          <div className="gf-form">
            <FormField
              label="Database Type"
              inputWidth={30}
              labelWidth={10}
              tooltip={'Database Type'}
              inputEl={get('type')}
            />
          </div>
          <div className="gf-form">
            <FormField
              label="Database Name"
              inputWidth={30}
              labelWidth={10}
              tooltip={'Database Name'}
              inputEl={get('database')}
            />
          </div>
          <div className="gf-form-inline">
            <FormField
              label="User Name"
              inputWidth={20}
              labelWidth={10}
              tooltip={'Database User Name'}
              inputEl={get('username')}
            />
            <FormField
              label="Password"
              inputWidth={20}
              labelWidth={10}
              tooltip={'Database User Password'}
              inputEl={get('password')}
            />
          </div>
        </div>

        <h3 className="page-heading">Alerting</h3>
        <div className="gf-form-group">
          <div className="gf-form-inline">
            <div className="gf-form">
              <LegacyForms.Switch
                label="Enable"
                tooltip="Enable alerting"
                checked={this.state.backend || false}
                onChange={this.onToggleChange}
                labelClass="width-10"
                switchClass="max-width-6"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
