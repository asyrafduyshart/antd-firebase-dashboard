import { getAllOrders, getNextAllOrders } from '../services/firebase';

export default {
  namespace: 'orders',

  state: {
    list: [],
    lastVisible: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      const { orders, lastVisible } = yield call(getAllOrders);
      yield put({
        type: 'queryList',
        payload: { orders, lastVisible },
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const { orders, lastVisible } = yield call(getNextAllOrders, payload);
      yield put({
        type: 'appendList',
        payload: { orders, lastVisible },
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      const { orders, lastVisible } = payload;
      return {
        ...state,
        list: orders,
        lastVisible,
      };
    },
    appendList(state, { payload }) {
      const { orders, lastVisible } = payload;
      return {
        ...state,
        list: state.list.concat(orders),
        lastVisible,
      };
    },
  },
};
