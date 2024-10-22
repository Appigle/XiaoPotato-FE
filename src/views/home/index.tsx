import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import ArtTypeList from '@src/components/ArtTypeList';
import { NavbarWithSearch } from '@src/components/NavbarWithSearch';
import Sidebar from '@src/components/Sidebar';
import useGlobalStore from '@src/stores/useGlobalStore';
import React, { useCallback, useEffect, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';
import mockData from './mock.json';

// Types
interface CardData {
  id: number;
  title: string;
  image: string;
  username: string;
  likes: number;
  userAvatar: string;
}

// Update CardList component to include infinite scroll
const CardList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const { currentArtType, isLoading, setIsLoading } = useGlobalStore();
  const [page, setPage] = useState(1);
  console.log('%c [ page ]-244', 'font-size:13px; background:pink; color:#bf2c9f;', page);

  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // const response = await axios.get(`/api/cards?category=${currentArtType}&page=${page}`);
      setCards((prevCards) => [...prevCards, ...mockData]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    setCards([]);
    setPage(1);
    loadMoreCards();
  }, [currentArtType, loadMoreCards]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMoreCards();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreCards]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.id} className="max-w-sm overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none"
          >
            <img src={card.image} alt={card.title} className="w-full" />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray">
              {card.title}
            </Typography>
            <Typography variant="small" color="gray">
              {card.username}
            </Typography>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar src={card.userAvatar} alt={card.username} size="sm" />
              <Typography variant="small" color="gray" className="ml-2">
                {card.likes} likes
              </Typography>
            </div>
            <IconButton variant="text" color="blue-gray">
              {/* <HeartIcon className="h-5 w-5" /> */}
              HeartIcon
            </IconButton>
          </CardFooter>
        </Card>
      ))}
      {isLoading && <div className="col-span-full text-center">Loading...</div>}
    </div>
  );
};

const Main: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    setScrollTop((e.target as HTMLElement).scrollTop);
  };
  return (
    <main
      className="flex-1 overflow-y-auto"
      onScroll={(e) => {
        handleScroll(e);
      }}
    >
      <ArtTypeList scrollTop={scrollTop} />
      <CardList />
    </main>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col bg-potato-white dark:bg-blue-gray-900">
      <NavbarWithSearch />
      <div className="flex h-[calc(100%-80px)] flex-1">
        <Sidebar />
        <Main />
      </div>
      <HiRefresh
        className="hover:scale-120 fixed bottom-[50px] right-[50px] z-20 rounded-full text-2xl transition-all hover:cursor-pointer"
        onClick={() => window.location.reload()}
      ></HiRefresh>
    </div>
  );
};

export default App;
