import Cookies from 'js-cookie'

const LoginKey = 'hasLogin'

export function getToken() {
  return Cookies.get(LoginKey);
}

export function setToken() {
  return Cookies.set(LoginKey, "1", {
    expires: 7
  })
}

export function removeToken() {
  return Cookies.remove(LoginKey)
}

//设置cookie
export function setCookie(cname, cvalue, exdays) { //exdays：保存的天数
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

//清除cookie  
export function clearCookie(name) {
  setCookie(name, "", -1);
}

export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}
