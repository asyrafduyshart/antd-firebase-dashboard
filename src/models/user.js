import { query as queryUsers } from '../services/user';
import { getCurrentFirebaseUser } from '../services/firebase';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

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
    *fetchCurrent(_, { call, put }) {
      const user = yield call(getCurrentFirebaseUser);
      yield setAuthority(user.authority);
      reloadAuthorized();

      try {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name: user.displayName,
            notifyCount: 12,
            userid: user.uid,
          },
        });
      } catch (error) {
        const { dispatch } = store;
        dispatch({
          type: 'login/logout',
        });
      }
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
