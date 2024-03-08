// services/cookieService.js
import Cookies from 'js-cookie';

export const saveObjectToCookie = (data, cookie_name) => {
  Cookies.set(cookie_name, JSON.stringify(data), { expires: 180 }); // Cookie expires in 7 days
};

export const getObjectFromCookie = (cookie_name) => {
  const cookieData = Cookies.get(cookie_name);
  console.log(cookieData);
  return cookieData ? JSON.parse(cookieData) : null;
};

export const clearCookie = (cookie_name) => {
  Cookies.remove(cookie_name);
};
