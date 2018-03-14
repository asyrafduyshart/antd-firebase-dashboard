import { routerRedux } from 'dva/router';
import { setAuthority, setWebToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { fetchRegisterWithEmail, fetchSendVerification, fetchWithCredential } from '../services/firebase';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { type, username } = payload;
      if (type === 'mobile') {
        try {
          const response = yield call(fetchWithCredential, payload);
          const { status, token } = response;
          yield put({
            type: 'registerHandle',
            payload: {
              status,
              type,
              currentAuthority: 'user',
              token,
            },
          });

          reloadAuthorized();
          yield put(routerRedux.push({
            pathname: '/',
          }));
        } catch (error) {
          yield put({
            type: 'registerHandle',
            payload: {
              status: 'error',
              type,
              currentAuthority: 'guest',
              message: error.message,
            },
          });
        }
      } else if (type === 'email') {
        try {
          const { email, emailVerified } = yield call(fetchRegisterWithEmail, payload);
          reloadAuthorized();
          yield put(routerRedux.push({
            pathname: '/user/register-result',
            state: {
              email,
              username,
              verified: emailVerified,
            },
          }));
        } catch (error) {
          yield put({
            type: 'registerHandle',
            payload: {
              status: 'error',
              type,
              currentAuthority: 'guest',
              message: error.message,
            },
          });
        }
      }
    },
    *captcha({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSendVerification, payload);
        const { verificationId } = response;
        yield put({
          type: 'registerHandle',
          payload: {
            type: 'captcha',
            status: 'success',
            message: response.message,
            verificationId,
          },
        });
      } catch (error) {
        yield put({
          type: 'registerHandle',
          payload: {
            type: 'captcha',
            status: 'error',
            message: error.message,
          },
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      const { token, currentAuthority } = payload;
      setAuthority(currentAuthority);
      if (token) {
        setWebToken(token);
      }
      reloadAuthorized();
      return {
        ...state,
        ...payload,
      };
    },
  },
};
