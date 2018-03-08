import { routerRedux } from 'dva/router';
import { setAuthority, setWebToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { fetchLoginWithEmail, fetchSendVerification, fetchWithCredential, logoutFirebase } from '../services/firebase';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    verificationId: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { type } = payload;
      if (type === 'account') {
        try {
          const { emailVerified, token } = yield call(fetchLoginWithEmail, payload);
          if (emailVerified) {
            yield put({
              type: 'changeLoginStatus',
              payload: {
                status: 'ok',
                type,
                currentAuthority: 'admin',
                token,
              },
            });
            // Login successfully
            reloadAuthorized();
            yield put(routerRedux.push('/'));
          } else {
            yield put({
              type: 'changeLoginStatus',
              payload: {
                status: 'error',
                type,
                currentAuthority: 'guest',
                message: 'email not verified',
              },
            });
          }
        } catch (error) {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: 'error',
              type,
              currentAuthority: 'guest',
              message: error.message,
            },
          });
        }
      } else if (type === 'mobile') {
        try {
          const response = yield call(fetchWithCredential, payload);
          const { status, token } = response;
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status,
              type,
              currentAuthority: 'admin',
              token,
            },
          });
          reloadAuthorized();
          yield put(routerRedux.push('/'));
        } catch (error) {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: 'error',
              type,
              currentAuthority: 'admin',
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
          type: 'changeLoginStatus',
          payload: {
            type: 'captcha',
            status: 'success',
            message: response.message,
            verificationId,
          },
        });
      } catch (error) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            type: 'captcha',
            status: 'error',
            message: error.message,
          },
        });
      }
    },
    *logout(_, { put, call, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        yield call(logoutFirebase);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { token, currentAuthority } = payload;
      setAuthority(currentAuthority);
      if (token) {
        setWebToken(token);
      }
      return {
        ...state,
        ...payload,
      };
    },
  },
};
