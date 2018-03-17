import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
let statusTbl = ['OPEN', 'DEPLOY', 'CLOSE'];
let qrcode_url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521228296198&di=eae6e2a9afccd036a53433c5087dea64&imgtype=0&src=http%3A%2F%2Fwww.hzwestlake.gov.cn%2Fewebeditor%2Fuploadfile%2F20170504120633549.jpg';
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    createDate: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    name: `210800${i}`,
    state: statusTbl[Math.floor(Math.random() * 10) % 3],
    info: {
      shop: `商户某某某某餐厅${i}`,
    },
    partner: {
      name: `地区合伙人某某某${i}`,
    },
    qrcode_url: `http://sittest.51qingcheng.com/scan/point/${i}`,
  });
}

export function getPoint(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.text) {
    dataSource = dataSource.filter(data => {
      return data.name.indexOf(params.text) >= 0
        || data.info.shop.indexOf(params.text) >= 0
        || data.partner.name.indexOf(params.text) >= 0;
    });
  }

  if (params.state) {
    dataSource = dataSource.filter(data => data.state === params.state );
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postPoint(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, no, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
        no: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        description,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getPoint,
  postPoint,
};
