import { IPostItem } from './typePostItem';
import { IUserItem } from './typeUserItem';

export interface BaseRes<T> {
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: T | any;
  message: string;
  description: string;
}

export interface BaseResPageData<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface type_req_user_register
  extends Pick<IUserItem, 'firstName' | 'lastName' | 'userAccount' | 'gender' | 'phone' | 'email'> {
  checkPassword: string;
  userPassword: string;
}

export interface type_req_user_login {
  userAccount: string;
  userPassword: string;
}

export interface type_res_user_login extends IUserItem {}

export interface user_profile extends IUserItem {
  token?: string;
  commentsCount: number;
  description: string;
}

export interface type_req_update_profile {
  id: number;
  userAvatar?: string | null;
  email?: string;
  phone?: string;
  gender?: string;
  description?: string;
}

export interface type_req_get_post_by_page
  extends Partial<Pick<IPostItem, 'postTitle' | 'postContent' | 'postGenre'>> {
  currentPage: number;
  pageSize: number;
}
export interface type_res_get_post extends BaseResPageData<IPostItem> {}

export interface type_req_post_create
  extends Pick<IPostItem, 'postTitle' | 'postContent' | 'postGenre' | 'postImage'> {}

export interface Post extends IPostItem {
  user?: {
    // ? no references in code??
    userAccount: string;
    userAvatar: string | null;
  };
}
export interface type_req_get_fans_by_page {
  currentPage: number;
  pageSize: number;
}
