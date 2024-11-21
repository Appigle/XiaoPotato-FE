import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import { Avatar } from '@material-tailwind/react';
import { useGoToProfile } from '@src/utils/hooks/nav';

import { useEffect, useState } from 'react';

export type variant = 'circular' | 'rounded' | 'square';
export type size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type colors =
  | 'blue-gray'
  | 'gray'
  | 'brown'
  | 'deep-orange'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'light-green'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'light-blue'
  | 'blue'
  | 'indigo'
  | 'deep-purple'
  | 'purple'
  | 'pink'
  | 'red';
export interface XPAvatarProps extends Omit<React.ComponentProps<'img'>, 'ref'> {
  variant?: variant;
  size?: size;
  className?: string;
  withBorder?: boolean;
  color?: colors;
  defaultSrc?: string;
  userId: string | number;
}

const XPAvatar = (props: XPAvatarProps) => {
  const { src, defaultSrc, userId = '', ...rest } = props;
  const [userAvatar, setUserAvatar] = useState(src || defaultSrc || 'err');
  const gotoProfile = useGoToProfile();
  const handleAvatarError = () => {
    setUserAvatar(defaultUserAvatar);
  };
  useEffect(() => {
    setUserAvatar(src || defaultSrc || 'err');
  }, [src, defaultSrc]);
  return (
    <Avatar
      onError={handleAvatarError}
      src={userAvatar}
      onClick={() => !!userId && gotoProfile(userId)}
      {...rest}
      className={`${rest?.className} hover:cursor-pointer hover:opacity-50`}
    />
  );
};

export default XPAvatar;
