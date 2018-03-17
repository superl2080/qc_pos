import { getPointList, removePoint, addPoint } from '../services/point';

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
      const response = yield call(getPointList, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPoint, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
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
