import { typeEmail } from './common';
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
  sort?: 'asc' | 'desc' | '';
}
export interface type_res_get_post extends BaseResPageData<IPostItem> {}

export interface type_req_post_create
  extends Pick<
    IPostItem,
    'postTitle' | 'postContent' | 'postGenre' | 'postImage' | 'imageWidth' | 'imageHeight'
  > {}

export interface Post extends IPostItem {
  user?: {
    // ? no references in code??
    userAccount: string;
    userAvatar: string | null;
  };
}
export type type_req_base_page = {
  currentPage: number;
  pageSize: number;
};
export interface type_req_get_fans_by_page extends type_req_base_page {}

export interface ICommentItem {
  commentId: number;
  content: string;
  createTime: string;
  commentUserId: number;
  commentorFirstName: string;
  commentorLastName: string;
  commentorAccount: string;
  commentorAvatar: string;
  replyToUserId: number;
  replyToFirstName: string;
  replyToLastName: string;
  replyToAccount: string;
  replyToAvatar: string;
  secondLevelCount: number;
}

export interface type_req_get_post_1st_comment extends type_req_base_page {
  postId: number;
}
export interface type_req_get_post_2nd_comment extends type_req_base_page {
  commentId: number;
}
export interface type_req_create_post_comment {
  commentId?: number;
  content: string;
  postId: number;
}
export interface NotificationItem {
  sourceId: number;
  firstName: string;
  lastName: string;
  account: string;
  avatar: string;
  content: string;
  timestamp: string;
  notificationType: string;
}
export interface type_res_get_notifications extends BaseResPageData<NotificationItem> {}

export interface type_req_get_emails
  extends type_req_base_page,
    Partial<Pick<typeEmail, 'subject' | 'toUser' | 'content'>> {}

export interface type_req_send_email
  extends Partial<Pick<typeEmail, 'fromUser' | 'subject' | 'toUser' | 'content'>> {}
export interface type_req_get_all_users extends type_req_base_page {
  userId: number;
  searchName: string;
}
export interface type_req_get_all_post extends type_req_base_page {
  userId: number;
  postTitle: string;
  postContent: string;
  postGenre: string;
  sort: string;
}
