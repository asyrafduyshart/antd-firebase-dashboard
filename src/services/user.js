import request from '../utils/request';
import { FIREBASE_HOST_MOCK } from '../config/api-config';


export async function query() {
  return request(`${FIREBASE_HOST_MOCK}/api/users`);
}

export async function queryCurrent() {
  return request(`${FIREBASE_HOST_MOCK}/api/user`);
}
