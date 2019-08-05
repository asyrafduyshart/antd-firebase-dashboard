/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data was successful. ',
  202: 'A request has been queued into the background (asynchronous task). ',
  204: 'The data is deleted successfully. ',
  400: 'There was an error in the request made, the server did not make any new or modified data. ',
  401: 'The user does not have permission (token, username, password incorrect). ',
  403: 'User is authorized, but access is forbidden. ',
  404: 'issued a request for non-existent records, the server did not operate. ',
  406: 'The format of the request is not available. ',
  410: 'The requested resource is permanently deleted and will not be available again. ',
  422: 'A validation error occurred while creating an object. ',
  500: 'server error occurred, please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is unavailable, the server is temporarily overloaded or serviced. ',
  504: 'Gateway timed out. ',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  if (status === 401) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
