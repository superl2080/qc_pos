import { isUrl } from '../utils/utils';

const menuData = [{
  name: '工作台',
  icon: 'dashboard',
  path: 'home',

}, {
  name: '点位',
  icon: 'qrcode',
  path: 'point',
  children: [{
    name: '点位列表',
    path: 'list',
    hideInMenu: true,
  }, {
    name: '点位详情',
    path: 'detail/:id',
    hideInMenu: true,
  }],

}, {
  name: '个人中心',
  icon: 'user',
  path: 'user',
  children: [{
    name: '个人中心',
    path: 'my',
    hideInMenu: true,
  }, {
    name: '访客',
    path: 'guest',
    hideInMenu: true,
    authority: 'GUEST',
    children: [{
      name: '访客登录',
      path: 'login',
    }],
  }],

}, {
  name: 'exception',
  icon: 'warning',
  path: 'exception',
  hideInMenu: true,
  children: [{
    name: '403',
    path: '403',
  }, {
    name: '404',
    path: '404',
  }, {
    name: '500',
    path: '500',
  }],

}, {
  name: '结果页',
  icon: 'check-circle-o',
  path: 'result',
  authority: 'ADMIN',
  children: [{
    name: '成功',
    path: 'success',
  }, {
    name: '失败',
    path: 'fail',
  }],

}, {
  name: 'dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  authority: 'ADMIN',
  children: [{
    name: '分析页',
    path: 'analysis',
  }, {
    name: '监控页',
    path: 'monitor',
  }, {
    name: '工作台',
    path: 'workplace',
  }],
}, {
  name: '表单页',
  icon: 'form',
  path: 'form',
  authority: 'ADMIN',
  children: [{
    name: '基础表单',
    path: 'basic-form',
  }, {
    name: '分步表单',
    path: 'step-form',
  }, {
    name: '高级表单',
    path: 'advanced-form',
  }],
}, {
  name: '列表页',
  icon: 'table',
  path: 'list',
  authority: 'ADMIN',
  children: [{
    name: '查询表格',
    path: 'table-list',
  }, {
    name: '标准列表',
    path: 'basic-list',
  }, {
    name: '卡片列表',
    path: 'card-list',
  }, {
    name: '搜索列表',
    path: 'search',
    children: [{
      name: '搜索列表（文章）',
      path: 'articles',
    }, {
      name: '搜索列表（项目）',
      path: 'projects',
    }, {
      name: '搜索列表（应用）',
      path: 'applications',
    }],
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
  authority: 'ADMIN',
  children: [{
    name: '基础详情页',
    path: 'basic',
  }, {
    name: '高级详情页',
    path: 'advanced',
  }],
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
