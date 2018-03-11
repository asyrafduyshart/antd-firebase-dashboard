import { routerRedux } from 'dva/router';
import qs from 'qs';
import { message } from 'antd';
// import { fakeSubmitForm } from '../services/api';
import { addOrderData } from '../services/firebase';


export default {
  namespace: 'order',

  state: {
    step: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/orders') {
          const payload = qs.parse(location.search) || { page: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          });
        }
      });
    },
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      try {
        const { id } = yield call(addOrderData, payload);
        yield put({
          type: 'saveStepFormData',
          payload: {
            ...payload,
            id,
          },
        });
        yield put(routerRedux.push('/orders/request/result'));
      } catch (error) {
        message.error(error.message);
      }
    },
    *query({ payload }, { put }) {
      yield console.log('payload: ', payload);
      yield put({
        type: 'orders',
        payload,
      });
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    orders(state, { payload }) {
      return {
        ...state,
        payload,
      };
    },
  },
};
