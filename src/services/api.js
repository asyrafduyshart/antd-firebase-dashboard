import { stringify } from 'qs';
import request from '../utils/request';
import { FIREBASE_HOST_MOCK } from '../config/api-config';


export async function queryProjectNotice() {
  return request(`${FIREBASE_HOST_MOCK}/api/project/notice`);
}

export async function queryActivities() {
  return request(`${FIREBASE_HOST_MOCK}/api/activities`);
}

export async function queryRule(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/rule`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/rule`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/forms`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request(`${FIREBASE_HOST_MOCK}/api/fake_chart_data`);
}

export async function queryTags() {
  return request(`${FIREBASE_HOST_MOCK}/api/tags`);
}

export async function queryBasicProfile() {
  return request(`${FIREBASE_HOST_MOCK}/api/profile/basic`);
}

export async function queryAdvancedProfile() {
  return request(`${FIREBASE_HOST_MOCK}/api/profile/advanced`);
}

export async function queryFakeList(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/login/account`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request(`${FIREBASE_HOST_MOCK}/api/register`, {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request(`${FIREBASE_HOST_MOCK}/api/notices`);
}

export async function getToken(params) {
  return request('https://us-central1-zenbu-resto-user.cloudfunctions.net/api/auth', {
    method: 'POST',
    body: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  });
}
