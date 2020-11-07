import fetch from 'node-fetch';

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
