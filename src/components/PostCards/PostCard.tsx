import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import { IPostItem } from '@src/@types/typePostItem';
import Api from '@src/Api';
import HeartEffect from '@src/components/HeartEffect/index';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import { useEffect, useState } from 'react';
type PostCardProps = {
  card: IPostItem;
  index: number;
  onShowDetail?: (cardData: IPostItem) => void;
};
const PostCard = (props: PostCardProps) => {
  const { card: originalCard, index, onShowDetail } = props;
  const [card, setCard] = useState(originalCard);
  const userInfo = useGlobalStore((s) => s.userInfo);
  const [iconSize, setIconSize] = useState('h-8 w-8');
  const onLike = (isLike: boolean) => {
    console.log('%c [ isLike ]-25', 'font-size:13px; background:pink; color:#bf2c9f;', isLike);
    Api.xPotatoApi.postLike({ id: card.id as number }).then((res) => {
      const { data: isLikeSuc, code } = res;
      if (code === HTTP_RES_CODE.SUCCESS) {
        setCard({
          ...card,
          likeCount: isLikeSuc ? card.likeCount + 1 : card.likeCount - 1,
          isLiked: isLikeSuc,
        });
      }
    });
    // setCard({ ...card, likes: isLike ? card.likes + 1 : card.likes - 1, isLiked: !card.isLiked });
    // setIsLiked(isLike);
    // setIconSize('h-9 w-9');
  };

  useEffect(() => {
    setTimeout(() => {
      setIconSize('h-8 w-8');
    });
  }, [iconSize]);

  const openDetail = () => {
    onShowDetail?.(card);
  };

  return (
    <Card
      key={card.id}
      className="dark: max-w-sm overflow-hidden bg-gray-100 shadow-md shadow-blue-gray-500 dark:bg-blue-gray-900"
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 cursor-pointer rounded-none"
        onClick={openDetail}
      >
        <img src={card.postImage?.[0] || ''} alt={card.postTitle} className="w-full" />
      </CardHeader>
      <CardBody className="flex flex-1 cursor-pointer" onClick={openDetail}>
        <Typography
          variant="paragraph"
          title={card.postTitle}
          className="text-md three-line-ellipsis text-blue-900 dark:text-gray-100"
        >
          {index + 1}-{card.postTitle}
        </Typography>
      </CardBody>
      <CardFooter className="flex items-center !p-4">
        <div className="flex w-full flex-1 items-center justify-between">
          <Typography
            variant="small"
            className="flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap text-blue-gray-900 dark:text-gray-100"
          >
            <Avatar src={userInfo?.userAvatar || ''} alt={userInfo?.lastName} size="sm" />
            <span className="ml-2 text-sm" title={userInfo?.lastName}>
              {userInfo?.lastName}
            </span>
          </Typography>
          <div className="flex flex-1 items-center justify-end">
            <Typography
              variant="small"
              color="gray"
              className="ml-2 flex items-center justify-end gap-1"
            >
              <span className="select-none">{card.likeCount}</span>
              <span className="hidden select-none text-sm xl:inline-block">likes</span>
            </Typography>

            <HeartEffect
              checked={card.isLiked}
              height={60}
              width={60}
              onChange={(b: boolean) => onLike(b)}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
