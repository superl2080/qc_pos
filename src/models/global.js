import { getCurrentEnv } from '../services/global';

export default {
  namespace: 'global',

  state: {
    isMobile: false,
    collapsed: false,
    currentEnv: {},
  },

  effects: {
    *getCurrentEnv({ payload }, { call, put }) {
      const response = yield call(getCurrentEnv, payload);
      yield put({
        type: 'changeCurrentEnv',
        payload: response,
      });
    },
  },

  reducers: {
    changeCurrentEnv(state, { payload }) {
      return {
        ...state,
        currentEnv: payload,
      };
    },

    changeLayoutisMobile(state, { payload }) {
      return {
        ...state,
        isMobile: payload,
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
