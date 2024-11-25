export type typeNavMenuItem = {
  name?: string;
  path: string;
  icon?: string;
  redirect?: boolean;
};

export interface typeEmail {
  emailId: number;
  userId: number;
  fromUser: string;
  toUser: string;
  subject: string;
  content: string;
  createTime: string;
  isDelete: number;
}
