import {
  BaseRes,
  type_req_user_login,
  type_req_user_register,
  type_res_user_login,
  type_res_user_register,
  user_profile,
} from '@/@types/request/XPotato';
import X_POTATO_URL from '@src/constants/xPotatoUrl';
import useRequest from '@src/utils/request';
const baseURL = X_POTATO_URL.BASE_URL;

// run xPotato-be + http://localhost:8080/swagger-ui/index.html#/User%20Controller/userLogin
/**
 * register xiao-potato account
 * @param userAccount string
 * @param userPassword string
 * @returns Promise<BaseRes<type_res_user_register>>
 */
const registerAccount = (registerData: type_req_user_register) => {
  return useRequest.post<BaseRes<type_res_user_register>>({
    baseURL,
    url: X_POTATO_URL.REGISTER_ACCOUNT,
    abortRepetitiveRequest: true,
    data: registerData,
  });
};

/**
 * login xiao-potato account
 */
const userLogin = (loginData: type_req_user_login) => {
  return useRequest.post<BaseRes<type_res_user_login>>({
    baseURL,
    url: X_POTATO_URL.USER_LOGIN,
    abortRepetitiveRequest: true,
    data: loginData,
  });
};

/**
 * get current user profile
 * @returns user profile
 */
const userCurrent = () => {
  return useRequest.get<BaseRes<user_profile>>({
    baseURL,
    url: X_POTATO_URL.USER_CURRENT,
    abortRepetitiveRequest: true,
  });
};

export default {
  registerAccount,
  userLogin,
  userCurrent,
};
