// for dev/prod env
const BASE_URL = import.meta.env.VITE_X_POTATO_BASE_URL;
export default {
  BASE_URL,
  GET_USER: '/user/current',
  REGISTER_ACCOUNT: '/user/register',
  USER_LOGIN: '/user/login',
  USER_CURRENT: '/user/current',
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  UPLOAD_FILE: '/common/upload',
  POST_CREATE: '/post/create',
  POST_FILTER_PAGES: '/post/selectByPage',
  POST_FILTER_ID: '/post/selectById',
  POST_UPLOAD: '/post/upload',
  POST_DELETE: '/post/delete',
  POST_LIKE: '/like/likeByPostId',
  POST_SAVE: '/post/save',
  GET_USER_POSTS: '/post/selectByUserId',
};
