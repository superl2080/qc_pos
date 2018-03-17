import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getPoint, postPoint } from './mock/point';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /pos/getCurrentEnv': (req, res) => {
    res.send({
      SIT_URL: "http://sittest.51qingcheng.com",
    });
  },
  'POST /pos/partner/login': (req, res) => {
    const { password, logid, type } = req.body;
    if(password === '1' && logid === 'ADMIN'){
      res.send({
        code: 0,
        data: {
          token: 'a',
          character: 'ADMIN',
        },
      });
      return ;
    }
    if(password === '1' && logid === 'OPERATOR'){
      res.send({
        code: 0,
        data: {
          token: 'b',
          character: 'OPERATOR',
        },
      });
      return ;
    }
    if(password === '1' && logid === 'DEVICER'){
      res.send({
        code: 0,
        data: {
          token: 'c',
          character: 'DEVICER',
        },
      });
      return ;
    }
    if(password === '1' && logid === 'AGENT'){
      res.send({
        code: 0,
        data: {
          token: 'd',
          character: 'AGENT',
        },
      });
      return ;
    }
    res.send({
      code: 220000,
      data: {
        token: undefined,
        character: 'GUEST',
      },
    });
  },
  'GET /pos/point': getPoint,
  'POST /api/point': {
    $body: postPoint,
  },
  // 支持值为 Object 和 Array
  'GET /api/partner': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
    },
  },
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
};

export default noProxy ? {} : delay(proxy, 1000);
