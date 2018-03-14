// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  console.log('getAuthority');
  return localStorage.getItem('web-authority') || 'guest';
}

export function setAuthority(authority) {
  console.log('setAuthority');
  return localStorage.setItem('web-authority', authority);
}

export function setWebToken(token) {
  return localStorage.setItem('web-token', token);
}

export function getWebToken() {
  return localStorage.getItem('web-token');
}
