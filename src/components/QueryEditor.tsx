import React, { Component } from 'react';
import { DataSource } from '../Datasource';
import { QueryEditorProps, DataSourceJsonData } from '@grafana/data';
import { SqlQuery, SqlOptions } from 'types';
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
require('codemirror/mode/sql/sql');
import './QueryEditor.scss';

type Props = QueryEditorProps<DataSource, SqlQuery, SqlOptions>;

interface State {
  sql: string;
}

export class QueryEditor extends Component<Props, State> {
  constructor(props: QueryEditorProps<DataSource, SqlQuery, DataSourceJsonData>, context: any) {
    super(props, context);
    this.state = { sql: props.query.sql };
  }

  onChange = (editor: any, event: Event) => {
    const { onChange, query, onRunQuery } = this.props;
    const sql = this.state.sql;
    this.setState({ sql });
    onChange({ ...query, sql });
    onRunQuery(); // executes the query
  };

  render() {
    const { sql } = this.state;

    const options = {
      mode: 'sql',
      theme: 'darcula',
    };

    return (
      <>
        <div className={'sql-query-editor'}>
          <CodeMirror
            value={sql}
            options={options}
            onBeforeChange={(editor, data, value) => {
              this.setState({ sql: value });
            }}
            onChange={(editor, data, value) => {
              this.setState({ sql: value });
            }}
            onBlur={(editor, event) => {
              this.onChange(editor, event);
            }}
          />
        </div>
      </>
    );
  }
}
