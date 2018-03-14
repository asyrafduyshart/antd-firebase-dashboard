import { isUrl } from '../utils/utils';

const menuData = [{
  name: 'Dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: 'Analysis',
    path: 'analysis',
  }, {
    name: 'Monitoring',
    path: 'monitor',
  }, {
    name: 'Work Place',
    path: 'workplace',
    authority: 'admin',
    // hideInMenu: true,
  }],
}, {
  name: 'Order',
  icon: 'form',
  path: 'orders',
  children: [{
    name: 'All Order',
    path: 'all',
  }, {
    name: 'Request Order',
    path: 'request',
  }, {
    name: 'My Order',
    path: 'order',
  }],
}, {
  name: 'Error Page',
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
  }, {
    name: 'Error Trigger',
    path: 'trigger',
    hideInMenu: true,
  }],
}, {
  name: 'User',
  icon: 'user',
  path: 'user',
  authority: 'guest',
  children: [{
    name: 'Login',
    path: 'login',
  }, {
    name: 'Register',
    path: 'register',
  }, {
    name: 'Register Result',
    path: 'register-result',
  }],
}];

function formatter(data, parentPath = '/', parentAuthority) {
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
