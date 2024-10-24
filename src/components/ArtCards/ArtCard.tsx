import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import { ArtCardData } from '@src/@types/artCard';
import HeartEffect from '@src/components/HeartEffect/index';
import { useEffect, useState } from 'react';
type ArtCardProps = {
  card: ArtCardData;
  index: number;
};
const ArtCard = (props: ArtCardProps) => {
  const { card: originalCard, index } = props;
  const [card, setCard] = useState(originalCard);
  // const [isLiked, setIsLiked] = useState(card.isLiked);
  const [iconSize, setIconSize] = useState('h-8 w-8');
  const onLike = (isLike: boolean) => {
    setCard({ ...card, likes: isLike ? card.likes + 1 : card.likes - 1, isLiked: !card.isLiked });
    // setIsLiked(isLike);
    // setIconSize('h-9 w-9');
  };

  useEffect(() => {
    setTimeout(() => {
      setIconSize('h-8 w-8');
    });
  }, [iconSize]);

  return (
    <>
      <Card
        key={card.id}
        className="dark: max-w-sm overflow-hidden bg-gray-100 shadow-md shadow-blue-gray-500 dark:bg-blue-gray-900"
      >
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 rounded-none">
          <img src={card.image?.[0]} alt={card.title} className="w-full" />
        </CardHeader>
        <CardBody className="flex flex-1">
          <Typography
            variant="paragraph"
            title={card.title}
            className="text-md three-line-ellipsis text-blue-900 dark:text-gray-100"
          >
            {index + 1}-{card.title}
          </Typography>
        </CardBody>
        <CardFooter className="flex items-center !p-4">
          <div className="flex w-full flex-1 items-center justify-between">
            <Typography
              variant="small"
              className="flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap text-blue-gray-900 dark:text-gray-100"
            >
              <Avatar src={card.userAvatar} alt={card.username} size="sm" />
              <span className="ml-2 text-sm" title={card.username}>
                {card.username}
              </span>
            </Typography>
            <div className="flex flex-1 items-center justify-end">
              <Typography
                variant="small"
                color="gray"
                className="ml-2 flex items-center justify-end gap-1"
              >
                <span className="select-none">{card.likes}</span>
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
    </>
  );
};

export default ArtCard;
