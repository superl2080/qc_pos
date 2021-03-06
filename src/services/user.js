import { stringify } from 'qs';
import request from '../utils/request';

export async function partnerLogin(params) {
  return request('/pos/partner/login', {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrent() {
  return request('/api/partner');
}
