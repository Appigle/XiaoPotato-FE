export type typeNavMenuItem = {
  name?: string;
  path: string;
  icon?: string;
  redirect?: boolean;
};

export type typeEmail = {
  id?: string;
  toUser: string | string[];
  fromUser: string;
  subject: string;
  content: string;
};
