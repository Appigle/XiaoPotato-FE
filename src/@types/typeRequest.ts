import { IPostItem } from './typePostItem';

export interface BaseRes<T> {
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: T | any;
  message: string;
  description: string;
}

export interface type_req_user_register {
  firstName: string;
  lastName: string;
  userAccount: string;
  userPassword: string;
  checkPassword: string;
  email: string;
  phone: string;
  gender: string;
}
export type type_res_user_register = number | null;

export interface type_req_user_login {
  userAccount: string;
  userPassword: string;
}

export interface type_res_user_login {
  id: number;
  firstName: string;
  lastName: string;
  userAccount: string;
  userAvatar: string | null;
  email: string;
  phone: string;
  gender: string;
  userRole: string;
  status: number;
}

export interface user_profile extends type_res_user_login {
  token?: string;
  followingsCount: number;
  followersCount: number;
  commentsCount: number;
  bio: string;
}
export type type_res_user_profile = user_profile;

export interface type_req_update_profile {
  firstName: string;
  lastName: string;
  userAvatar?: string | null;
  email?: string;
  phone?: string;
  gender?: string;
  bio?: string;
}
export interface type_res_update_profile {
  success: boolean;
  message: string;
}

export interface type_req_get_post_by_page
  extends Pick<IPostItem, 'postTitle' | 'postContent' | 'postGenre'> {
  currentPage: number;
  pageSize: number;
}
export interface type_res_get_post {
  records: IPostItem[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface type_req_post_create
  extends Pick<IPostItem, 'postTitle' | 'postContent' | 'postGenre' | 'postImage'> {}

export interface type_req_post_query {
  currentPage: number;
  pageSize: number;
  postTitle?: string;
  postContent?: string;
  postGenre?: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
export interface Post extends IPostItem {
  user?: {
    userAccount: string;
    userAvatar: string | null;
  };
}

export type type_res_user_posts = PageResult<Post>;
