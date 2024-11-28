import { typeEmail } from '@src/@types/common';
import { IPostItem } from '@src/@types/typePostItem';
import {
  BaseRes,
  BaseResPageData,
  ICommentItem,
  Post,
  type_req_base_page,
  type_req_create_post_comment,
  type_req_get_all_post,
  type_req_get_all_users,
  type_req_get_emails,
  type_req_get_fans_by_page,
  type_req_get_post_1st_comment,
  type_req_get_post_2nd_comment,
  type_req_get_post_by_page,
  type_req_post_create,
  type_req_send_email,
  type_req_update_profile,
  type_req_user_login,
  type_req_user_register,
  type_res_get_notifications,
  type_res_get_post,
  type_res_user_login,
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
 * @returns Promise<BaseRes<number>>
 */
const registerAccount = (registerData: type_req_user_register) => {
  return useRequest.post<BaseRes<number>>({
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
 * @returns Promise<BaseRes<user_profile>>
 */
const getUserProfile = (userId: string | number) => {
  return useRequest.get<BaseRes<user_profile>>({
    baseURL,
    url: X_POTATO_URL.GET_USER,
    abortRepetitiveRequest: true,
    params: { id: userId },
  });
};

/**
 * update profile
 * @param updateData type_req_update_profile
 * @returns Promise<BaseRes<type_res_update_profile>>
 */
const updateUserProfile = (updateData: type_req_update_profile) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.UPDATE_PROFILE,
    data: updateData,
  });
};

/**
 * follow some user
 * @param data id: post.creatorId
 * @returns Promise<BaseRes<boolean>>
 */
const followUser = (data: { id: number }) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.FOLLOW_FOLLOW_USER,
    data,
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
const postLike = (data: { id: number; liked?: boolean }) => {
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
const postSave = (data: { id: number }) => {
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
 * delete a post
 * @returns Promise<BaseRes<boolean>>
 */
const postDelete = (data: { id: number }) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.POST_DELETE,
    data,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'), // 或其他认证方式
    },
  });
};

/**
 * update a post
 * @returns Promise<BaseRes<boolean>>
 */
const postUpdate = (data: Partial<IPostItem>) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.POST_UPDATE,
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
 * @param queryParams type_req_get_post_by_page
 * @returns Promise<BaseRes<BaseResPageData<Post>>>
 */
const getUserPosts = (userId: number, queryParams: type_req_get_fans_by_page) => {
  return useRequest.get<BaseRes<BaseResPageData<Post>>>({
    baseURL,
    url: `/post/selectByUserId`,
    params: {
      userId,
      ...queryParams,
    },
    abortRepetitiveRequest: true,
  });
};
const getUserFans = (params: { userId: number; currentPage: number; pageSize: number }) => {
  return useRequest.get<BaseRes<BaseResPageData<type_res_user_login>>>({
    baseURL,
    url: `/user/fans`,
    params,
    abortRepetitiveRequest: true,
  });
};
const getUserFollowings = (params: { userId: number; currentPage: number; pageSize: number }) => {
  return useRequest.get<BaseRes<BaseResPageData<type_res_user_login>>>({
    baseURL,
    url: `/user/follows`,
    params,
    abortRepetitiveRequest: true,
  });
};

/**
 * get post 1st level comment
 * @param params type_req_get_post_1st_comment
 * @returns Promise<BaseRes<BaseResPageData<ICommentItem>>>
 */
const getPost1stComment = (params: type_req_get_post_1st_comment) => {
  return useRequest.get<BaseRes<BaseResPageData<ICommentItem>>>({
    baseURL,
    url: `/comment/first-level`,
    params,
  });
};

/**
 * get post 2nd response comment
 * @param params type_req_get_post_2nd_comment
 * @returns Promise<BaseRes<BaseResPageData<ICommentItem>>>
 */
const getPost2ndComment = (params: type_req_get_post_2nd_comment) => {
  return useRequest.get<BaseRes<BaseResPageData<ICommentItem>>>({
    baseURL,
    url: `/comment/second-level`,
    params,
  });
};

/**
 * delete user's post comment
 * @param params { commentId: number }
 * @returns Promise<BaseRes<boolean:isDeleted>>
 */
const deletePostComment = (data: { id: number }) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: `/comment/deleteByCommentId`,
    data,
  });
};

/**
 * create post 1st level comment
 * @param params type_req_create_post_comment
 * @returns Promise<BaseRes<number:commentId>>
 */
const createPost1stComment = (data: type_req_create_post_comment) => {
  return useRequest.post<BaseRes<number>>({
    baseURL,
    url: `/comment/createFirstComment`,
    data,
  });
};

/**
 * create post 2nd response comment
 * @param params type_req_create_post_comment
 * @returns Promise<BaseRes<number:commentId>>
 */
const createPost2ndComment = (data: type_req_create_post_comment) => {
  return useRequest.post<BaseRes<number>>({
    baseURL,
    url: `/comment/createSecondComment`,
    data,
  });
};

/**
 * get notifications
 * @oaram params type_req_base_page
 * @returns type_res_get_notifications
 */

const getNotifications = (params: type_req_base_page) => {
  return useRequest.get<BaseRes<type_res_get_notifications>>({
    baseURL,
    url: `/user/selectNotificationByPage`,
    params,
  });
};

/**
 * send email to user
 * @param params typeEmail
 * @returns Promise<BaseRes<boolean>>
 */
const sendEmail = (data: type_req_send_email) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.EMAIL_SEND,
    data,
  });
};

/**
 * delete email
 * @returns Promise<BaseRes<boolean>>
 */
const deleteEmail = (id: number) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: X_POTATO_URL.EMAIL_DELETE,
    data: { id },
    abortRepetitiveRequest: false,
    retryConfig: {
      count: 1,
      waitTime: 0,
    },
  });
};

/**
 * get user's email
 * @param params type_req_get_emails
 * @returns Promise<BaseRes<BaseResPageData<typeEmail>>>
 */
const getEmailByPage = (params: type_req_get_emails) => {
  return useRequest.get<BaseRes<BaseResPageData<typeEmail>>>({
    baseURL,
    url: X_POTATO_URL.EMAIL_SELECT_BY_PAGE,
    params,
  });
};

/**
 * get all users
 * @param params type_req_get_all_users
 * @returns  Promise<BaseRes<BaseResPageData<type_res_user_login>>>
 */
const getAllUsers = (params: type_req_get_all_users) => {
  console.log('Making request to:', X_POTATO_URL.ADMIN_GET_USERS);
  return useRequest.get<BaseRes<BaseResPageData<type_res_user_login>>>({
    baseURL,
    url: X_POTATO_URL.ADMIN_GET_USERS,
    params,
  });
};

const deleteUser = (id: number) => {
  return useRequest.post<BaseRes<boolean>>({
    baseURL,
    url: `/user/deleteById`,
    data: { id },
  });
};

/**Get all post
 * @param params type_req_get_all_post
 * @returns Promise<BaseRes<BaseResPageData<IPostItem>>>
 */

const getAllPost = (params: type_req_get_all_post) => {
  return useRequest.get<BaseRes<BaseResPageData<IPostItem>>>({
    baseURL,
    url: X_POTATO_URL.ADMIN_GET_POSTS,
    params,
  });
};

/**Get unread notification count
 * @returns Promise<BaseRes<number>>
 */
const getUserUnreadNotificationCount = (params: { id: number }) => {
  return useRequest.get<BaseRes<number>>({
    baseURL,
    url: X_POTATO_URL.USER_GET_NOTIFICATION_COUNT,
    params,
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
  postDelete,
  postUpdate,
  useRequest,
  getUserPosts,
  followUser,
  getUserFans,
  getUserFollowings,
  getPost1stComment,
  getPost2ndComment,
  createPost1stComment,
  createPost2ndComment,
  deletePostComment,
  sendEmail,
  getNotifications,
  deleteEmail,
  getEmailByPage,
  getAllUsers,
  deleteUser,
  getAllPost,
  getUserUnreadNotificationCount,
};
