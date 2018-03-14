const checkType = (fn) => {
  if (typeof fn !== 'function') {
    const typeName = typeof fn;
    throw Error(`Invalid param \`fn\` of type \`${typeName}\`, expected \`function\``);
  }
};

export const takeEvery = (fn) => {
  checkType(fn);
  return [fn, { type: 'takeEvery' }];
};

export const takeLatest = (fn) => {
  checkType(fn);
  return [fn, { type: 'takeLatest' }];
};

export const watcher = (fn) => {
  checkType(fn);
  return [fn, { type: 'watcher' }];
};

export const delay = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
