import {
  BaseRes,
  type_req_get_post_by_page,
  type_req_post_create,
  type_req_post_query,
  type_req_update_profile,
  type_req_user_login,
  type_req_user_register,
  type_res_get_post,
  type_res_update_profile,
  type_res_user_login,
  type_res_user_posts,
  type_res_user_profile,
  type_res_user_register,
  user_profile,
} from '@src/@types/typeRequest';
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
    params: {
      noResCheck: true,
    },
  });
};

/**
 * get user profile
 * @returns Promise<BaseRes<type_res_user_profile>>
 */
const getUserProfile = () => {
  return useRequest.get<BaseRes<type_res_user_profile>>({
    baseURL,
    url: X_POTATO_URL.GET_USER,
    abortRepetitiveRequest: true,
  });
};

/**
 * update profile
 * @param updateData type_req_update_profile
 * @returns Promise<BaseRes<type_res_update_profile>>
 */
const updateUserProfile = (updateData: type_req_update_profile) => {
  return useRequest.post<BaseRes<type_res_update_profile>>({
    baseURL,
    url: X_POTATO_URL.UPDATE_PROFILE,
    data: updateData,
  });
};

/**
 * common upload file
 * @param file image/video(todo)
 * @returns Promise<BaseRes<string>>
 */
const uploadFile = (formData: FormData) => {
  return useRequest.uploadFile<BaseRes<string>>({
    baseURL,
    url: X_POTATO_URL.UPLOAD_FILE,
    data: formData,
  });
};

/**
 * Like/dislike the post
 * @returns Promise<BaseRes<boolean>>
 */
const postLike = (data: { id: number }) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.POST_LIKE,
    data,
  });
};

/**
 * collection/cancel collection the post
 * @returns Promise<BaseRes<boolean>>
 */
const postSave = (data: { id: string }) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.POST_SAVE,
    data,
  });
};

/**
 * create a new post
 * @returns Promise<BaseRes<number>>
 */
const postCreate = (data: type_req_post_create) => {
  return useRequest.post<BaseRes<number>>({
    baseURL,
    url: X_POTATO_URL.POST_CREATE,
    data,
  });
};

/**
 * Get post list by page and search work
 * @returns Promise<BaseRes<number>>
 */
const getPostByPage = (data: type_req_get_post_by_page) => {
  return useRequest.get<BaseRes<type_res_get_post>>({
    baseURL,
    url: X_POTATO_URL.POST_FILTER_PAGES,
    params: data,
  });
};

/**
 * get user posts with pagination
 * @param userId number
 * @param queryParams type_req_post_query
 * @returns Promise<BaseRes<type_res_user_posts>>
 */
const getUserPosts = (userId: number, queryParams: type_req_post_query) => {
  return useRequest.get<BaseRes<type_res_user_posts>>({
    baseURL,
    url: `/post/selectByUserId`,
    params: {
      userId,
      ...queryParams,
    },
    abortRepetitiveRequest: true,
  });
};

export default {
  registerAccount,
  userLogin,
  userCurrent,
  getUserProfile,
  updateUserProfile,
  uploadFile,
  postCreate,
  postLike,
  postSave,
  getPostByPage,
  getUserPosts,
};
