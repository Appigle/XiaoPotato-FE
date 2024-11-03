interface IUserItem {
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
  description: string;
  followCount: number;
  fansCount: number;
  followed: boolean;
}

export type { IUserItem };
