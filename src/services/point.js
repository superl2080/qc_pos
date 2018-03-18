import { stringify } from 'qs';
import request from '../utils/request';


export async function getPointList(params) {
  return request(`/pos/point/getList?${stringify(params)}`);
}

export async function createPoint(params) {
  return request('/pos/point/create', {
    method: 'POST',
    body: params,
  });
}

export async function removePoint(params) {
  return request('/api/point', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
