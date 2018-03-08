import { query as queryUsers } from '../services/user';
import { getCurrentFirebaseUser } from '../services/firebase';
import store from '../index';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call }) {
      const callback = (user) => {
        const { dispatch } = store;
        if (!user) {
          dispatch({
            type: 'login/logout',
          });
        } else {
          dispatch({
            type: 'user/saveCurrentUser',
            payload: {
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
              name: user.displayName,
              notifyCount: 12,
              userid: user.uid,
            },
          });
        }
      };

      yield call(getCurrentFirebaseUser, callback);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
