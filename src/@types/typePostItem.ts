export type typePostGenre =
  | 'All'
  | 'Painting'
  | 'Sculpture'
  | 'Photography'
  | 'Graphic Design'
  | 'Mixed Media'
  | 'Impressionism'
  | 'Surrealism'
  | 'Abstract Expressionism'
  | 'Fauvism'
  | 'Baroque'
  | 'Romanticism';

export type typePostGenreItem = {
  emoji?: string;
  name: typePostGenre;
  desc?: string;
};

export type typeGenreNameMap = { [key in typePostGenre]: key };

interface IPostItem {
  id: number;
  postTitle: string;
  postContent: string;
  postImage: string;
  createTime: string;
  updateTime: string;
  commentCount: number;
  likeCount: number;
  postGenre: typePostGenre;
  creatorId: number;
  userFirstName: string;
  userLastName: string;
  userAccount: string;
  userAvatar: string;
  saveCount: number;
  liked: boolean;
  saved: boolean;
  followed: boolean;
  creatorFirstName: string;
  creatorLastName: string;
  creatorAccount: string;
  creatorAvatar: string;
}

type typePostListRef = {
  handleScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
};

export type { IPostItem, typePostListRef };
