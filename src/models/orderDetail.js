import pathToRegexp from 'path-to-regexp';
import { getOrderById, updateOrderData, addHistoryOrderData, getOrderHistory } from '../services/firebase';

export default {
  namespace: 'orderDetail',

  state: {
    payload: {},
    history: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/orders/:id').exec(pathname);
        if (match) {
          if (match[1] !== 'request' && match[1] !== 'order' && match[1] !== 'all') {
            dispatch({ type: 'query', payload: { id: match[1] } });
          }
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put, takeEvery, take }) {
      const { id } = payload;
      const orderDetail = yield call(getOrderById, id);
      const orderHistory = yield call(getOrderHistory, id);


      function* pushOrder(value) {
        yield put({
          type: 'querySuccess',
          payload: { id, ...value },
        });
      }

      function* pushOrderHistory(history) {
        yield put({
          type: 'historySuccess',
          payload: history,
        });
      }

      yield takeEvery(orderHistory, pushOrderHistory);
      yield takeEvery(orderDetail, pushOrder);


      yield take('CANCEL_WATCH');
      orderDetail.close();
      orderHistory.close();
    },
    *updateDocument({ payload }, { call }) {
      const { id } = payload;
      yield call(addHistoryOrderData, id, payload);
      yield call(updateOrderData, id, payload);
    },
    *unsubscribe(_, { put }) {
      yield put({ type: 'CANCEL_WATCH' });
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        payload,
      };
    },
    historySuccess(state, { payload }) {
      return {
        ...state,
        history: payload,
      };
    },
  },
};
