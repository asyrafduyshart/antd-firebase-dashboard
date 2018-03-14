import AccessControl from 'accesscontrol';

const ac = new AccessControl();
ac.grant('user')
  .createOwn('orders')
  .deleteOwn('orders')
  .readOwn('orders')
  .updateOwn('submission', ['update'])
  .updateOwn('financeStatus', ['update'])
  .updateOwn('documentStatus', ['update'])
  .updateOwn('orderStart', ['start'])
  .grant('admin')
  .extend('user');

ac.grant('finance')
  .updateAny('financeStatus', ['*', '!update'])
  .updateAny('orderSuccess', ['*', '!start'])
  .grant('admin')
  .extend('finance');

ac.grant('verifier')
  .updateAny('documentStatus', ['approve', 'reject'])
  .updateAny('orderStatus', ['approve', 'reject'])
  .grant('admin')
  .extend('verifier');

ac.grant('guest');


export default ac;

