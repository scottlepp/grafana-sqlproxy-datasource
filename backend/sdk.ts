import fetch from 'node-fetch';
import { DataQuery } from "@grafana/tsbackend/dist/proto/backend_pb";
const clear_require = require('clear-require');
const devMode = true;

export function getModel<T>(q: DataQuery): T {
  const json = q.getJson();
  const jsonString: string = Buffer.from(json as string, 'base64').toString('ascii');
  return JSON.parse(jsonString);
}

export function doGet(url: string) {
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(r => r.json());
}

export function doPost(url: string, body: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  }).then(r => r.json());
}

export async function load(path: string) {
  if (devMode) {
    clear_require(path);
  }
  return await import(path);
}