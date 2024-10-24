// Types
interface ArtCardData {
  id: number | string;
  title: string;
  image: string;
  username: string;
  likes: number;
  isLiked?: boolean;
  userAvatar: string;
}

type ArtCardListRefType = {
  handleScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
};

export type { ArtCardData, ArtCardListRefType };
