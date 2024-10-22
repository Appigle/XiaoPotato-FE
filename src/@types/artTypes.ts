export type ArtNameType =
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

export type ArtItemType = {
  emoji?: string;
  name: ArtNameType;
  desc?: string;
};

export type ArtNameMap = { [key in ArtNameType]: key };
