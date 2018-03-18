import { routerRedux } from 'dva/router';
import { partnerLogin, queryUsers, queryCurrent } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    code: 99999,
    type: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(partnerLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, type: payload.type },
      });
      // Login successfully
      if (response.code === 0) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout({ callback }, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            code: 99999,
            data: {
              token: undefined,
              character: 'GUEST',
            },
            type: undefined,
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/guest/login'));
        if (callback) callback(false);
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority({ 
        character: payload.data.character, 
        token: payload.data.token,
      });
      return {
        ...state,
        code: payload.code,
        type: payload.type,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
