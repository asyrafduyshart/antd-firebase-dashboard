import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { getOrderById } from '../services/firebase';
import store from '../index';

export default {
  namespace: 'orderDetail',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/orders/:id').exec(pathname);
        if (match) {
          console.log('match: ', match);
          if (match[1] !== 'request' && match[1] !== 'order') {
            dispatch({ type: 'query', payload: { id: match[1] } });
          }
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(getOrderById, payload.id);
      if (response) {
        yield put({
          type: 'querySuccess',
          payload: response,
        });
      } else {
        message.error('Order not found');
        const { dispatch } = store;
        yield dispatch(routerRedux.push('/exception/404'));
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        payload,
      };
    },
  },
};
