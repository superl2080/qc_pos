import { stringify } from 'qs';
import request from '../utils/request';


export async function getPointList(params) {
  return request(`/pos/point/getList?${stringify(params)}`);
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

export async function addPoint(params) {
  return request('/api/point', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
