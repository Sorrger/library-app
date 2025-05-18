export function saveToken(token) {
    localStorage.setItem("access_token", token);
  }
  
export function getToken() {
  return localStorage.getItem("access_token");
}

export function getUserNameFromToken(){
  const token = getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.sub;
}

export function getUserRoleFromToken(){
  const token = getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role;
}
  
export function removeToken() {
  localStorage.removeItem("access_token");
}

export function isLoggedIn() {
  return !!getToken();
}