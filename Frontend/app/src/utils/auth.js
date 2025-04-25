export function saveToken(token) {
    localStorage.setItem("access_token", token);
  }
  
  export function getToken() {
    return localStorage.getItem("access_token");
  }
  
  export function removeToken() {
    localStorage.removeItem("access_token");
  }
  
  export function isLoggedIn() {
    return !!getToken();
  }