import { stringify } from 'qs';
import request from '../utils/request';

export async function getCurrentEnv() {
  return request('/pos/getCurrentEnv');
}
