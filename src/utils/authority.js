// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const token = localStorage.getItem('qc-token');
  let character = localStorage.getItem('qc-character');
  if( !character ) character = 'GUEST';
  return { token, character };
}

export function setAuthority(authority) {
  localStorage.setItem('qc-token', authority.token);
  localStorage.setItem('qc-character', authority.character);
  return true;
}
