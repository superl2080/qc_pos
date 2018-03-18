import { getPointList, createPoint, removePoint } from '../services/point';
import { getAuthority } from '../utils/authority';

export default {
  namespace: 'point',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getPointList, { ...payload, token: getAuthority().token });
      if( response.code === 0
        && response.data
        && response.data.list ) {
        response.data.list.forEach(d => d.key = d._id );
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *create({ payload, callback }, { call, put }) {
      const response = yield call(createPoint, payload);
      if( response.code === 0
        && response.data
        && response.data.list ) {
        response.data.list.forEach(d => d.key = d._id );
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response.code === 0);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removePoint, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
