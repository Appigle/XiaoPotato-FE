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
  isLiked: boolean;
  isSaved: boolean;
  genre: typePostGenre;
}

type typePostListRef = {
  handleScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
};

export type { IPostItem, typePostListRef };
