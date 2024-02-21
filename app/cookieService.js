// services/cookieService.js
import Cookies from 'js-cookie';

const COOKIE_NAME = 'myCookie';

export const saveObjectToCookie = (data) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: 180 }); // Cookie expires in 7 days
};

export const getObjectFromCookie = () => {
  const cookieData = Cookies.get(COOKIE_NAME);
  return cookieData ? JSON.parse(cookieData) : null;
};

export const clearCookie = () => {
  Cookies.remove(COOKIE_NAME);
};
