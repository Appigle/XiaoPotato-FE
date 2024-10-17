// for dev/prod env
const BASE_URL = import.meta.env.VITE_X_POTATO_BASE_URL;
export default {
  BASE_URL,
  GET_USER: '/user/current',
  REGISTER_ACCOUNT: '/user/register',
  USER_LOGIN: '/user/login',
  USER_CURRENT: '/user/current',
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update-profile',
};
