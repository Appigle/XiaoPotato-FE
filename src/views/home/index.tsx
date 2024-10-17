import {
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from '@material-tailwind/react';
import HorizontalList from '@src/components/HorizontalList';
import { NavbarWithSearch } from '@src/components/NavbarWithSearch';
import ART_TYPES from '@src/constants/ArtTyps';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { create } from 'zustand';
import mockData from './mock.json';

// Zustand store
interface AppState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  selectedCategory: 'All',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

// Types
interface CardData {
  id: number;
  title: string;
  image: string;
  username: string;
  likes: number;
  userAvatar: string;
}

// Sidebar component
const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${isExpanded ? 'w-56' : 'w-16'} flex flex-col justify-between`}
    >
      <nav className="p-4">
        <ul>
          <li className="mb-2 pl-2">
            <Link to="/discover" className="flex h-10 items-center justify-start transition-all">
              <IconButton variant="text" color="white">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Discovery
                </span>
              )}
            </Link>
          </li>
          <li className="mb-2 pl-2">
            <Link to="/publish" className="flex h-10 items-center justify-start transition-all">
              <IconButton variant="text" color="white">
                <Bars3Icon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Post
                </span>
              )}
            </Link>
          </li>
          <li className="mb-2 pl-2">
            <Link
              to="/notifications"
              className="flex h-10 items-center justify-start transition-all"
            >
              <IconButton variant="text" color="white">
                <HeartIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Notification
                </span>
              )}
            </Link>
          </li>
          <li className="mb-2 pl-2">
            <Link
              to="/profile"
              className="flex h-10 items-center justify-start overflow-hidden transition-all"
            >
              <IconButton variant="text" color="white">
                <UserCircleIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Me
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex justify-between p-4">
        <Popover placement="top-start">
          {isExpanded && (
            <PopoverHandler>
              <IconButton variant="text" color="white">
                <EllipsisHorizontalIcon className="h-5 w-5" />
                ell
              </IconButton>
            </PopoverHandler>
          )}
          <PopoverContent className="bg-gray-800 text-white">
            <ul className="space-y-2">
              <li>
                <Button variant="text" color="white" fullWidth>
                  About XiaoPotato
                </Button>
              </li>
              <li>
                <Button variant="text" color="white" fullWidth>
                  Privacy
                </Button>
              </li>
              <li>
                <Button variant="text" color="white" fullWidth>
                  Help Service
                </Button>
              </li>
              <li>
                <Button variant="text" color="white" fullWidth>
                  Setting
                </Button>
              </li>
              <li>
                <Button variant="text" color="white" fullWidth>
                  Dark
                </Button>
              </li>
              <li>
                <Button variant="text" color="white" fullWidth>
                  Logout
                </Button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <IconButton variant="text" color="white" onClick={toggleSidebar} className="transition-all">
          {isExpanded ? (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          )}
        </IconButton>
      </div>
    </div>
  );
};
// CategoryList component
const CategoryList: React.FC<{ scrollTop: number }> = ({ scrollTop }) => {
  const calcOpacity = useCallback(() => {
    return Math.min(0.8, scrollTop / 60);
  }, [scrollTop]);
  const [opacity, setOpacity] = useState(calcOpacity());
  const [activeStyle, setActiveStyle] = useState({});
  const [inActiveStyle, setInActiveStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});

  const style = {
    background: `rgba(255, 255, 255, ${opacity})`,
    color: `rgba(0, 0, 0, ${opacity})`,
  };
  const { selectedCategory = 'All', setSelectedCategory } = useAppStore();
  const categoriesRef = useRef(null);

  useEffect(() => {
    setOpacity(calcOpacity());
    // 0~0.5 -> bg-> transparent~0.5 text -> black 0~0.5
    // 0.5~1 -> bg-> 0.5~1 text -> black 0.5~1
    let color = `rgba(0, 0, 0, ${opacity})`;
    if (opacity <= 0.5) {
      color = `rgba(255, 255, 255, ${1 - opacity})`;
    }
    setActiveStyle({});
    setInActiveStyle({});
    setTextStyle({ color });
  }, [opacity, calcOpacity]);

  const items = ART_TYPES.map((m) => ({
    id: m.name,
    content: (
      <span className="whitespace-nowrap">
        {m.emoji} {m.name}
      </span>
    ),
  }));

  return (
    <div className="sticky top-0 z-10 mt-4" ref={categoriesRef} style={style}>
      <HorizontalList
        items={items}
        activeId={selectedCategory}
        activeStyle={activeStyle}
        inActiveStyle={inActiveStyle}
        textStyle={textStyle}
        onItemClick={(id) => {
          setSelectedCategory(id);
        }}
        className="my-4 flex-1"
      />
    </div>
  );
};

// Update CardList component to include infinite scroll
const CardList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const { selectedCategory, isLoading, setIsLoading } = useAppStore();
  const [page, setPage] = useState(1);
  console.log('%c [ page ]-244', 'font-size:13px; background:pink; color:#bf2c9f;', page);

  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // const response = await axios.get(`/api/cards?category=${selectedCategory}&page=${page}`);
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
  }, [selectedCategory]);

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
      <CategoryList scrollTop={scrollTop} />
      <CardList />
    </main>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
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
