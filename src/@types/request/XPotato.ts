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
}
