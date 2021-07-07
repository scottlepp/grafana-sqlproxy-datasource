import { DataFrame } from "@grafana/tsbackend";
import { DataQuery } from "@grafana/tsbackend/dist/proto/backend_pb";
import { SqlQuery } from "../shared/types";
import { doGet, getModel } from "./sdk";
import { ArrayDataFrame } from '@grafana/data';

export async function fetchResults(url: string, queries: DataQuery[]) {
  const results = queries.map(q => {
    const model = getModel<SqlQuery>(q);
    return doGet(`${url}/query?sql=${model.sql}`);
  });
  const all = await Promise.all(results);
  return all.map(r => arrayToDataFrame(r as unknown as Array<any>));
}

function arrayToDataFrame(array: any[]): DataFrame {
  return new ArrayDataFrame(array) as unknown as DataFrame;
}