import { routerRedux } from 'dva/router';
import { setAuthority, setWebToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { fetchLoginWithEmail, fetchSendVerification, fetchWithCredential } from '../services/firebase';


export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { type, username } = payload;
      yield console.log(payload);
      if (type === 'mobile') {
        try {
          const response = yield call(fetchWithCredential, payload);
          const { status, token } = response;
          yield put({
            type: 'registerHandle',
            payload: {
              status,
              type,
              currentAuthority: 'admin',
              token,
            },
          });

          if (status === 'ok') {
            reloadAuthorized();
            yield put(routerRedux.push({
              pathname: '/user/register-result',
              state: {
                username,
              },
            }));
          }
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
      const { status, type, message, verificationId, token, currentAuthority } = payload;
      setAuthority(currentAuthority);
      console.log(payload);
      if (token) {
        console.log(`TOKEN FROM FIREBASE ${token}`);
        setWebToken(token);
      }
      reloadAuthorized();
      return {
        ...state,
        status,
        type,
        message,
        verificationId,
      };
    },
  },
};
