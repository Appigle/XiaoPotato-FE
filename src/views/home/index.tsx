import { Spinner } from '@material-tailwind/react';
import { typePostListRef } from '@src/@types/typePostItem';
import PostGenreList from '@src/components/GenreTypeList';
import PostCardList from '@src/components/PostCards/PostCardList';
import Sidebar from '@src/components/Sidebar';
import useGlobalStore from '@src/stores/useGlobalStore';

import useTheme from '@src/utils/hooks/useTheme';
import React, { useEffect, useRef, useState } from 'react';

const Main: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const postCardListRef = useRef<typePostListRef>(null);
  const { userInfo, userChecking } = useGlobalStore();
  console.log(
    '%c [ userChecking ]-15',
    'font-size:13px; background:pink; color:#bf2c9f;',
    userChecking,
  );
  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    setScrollTop((e.target as HTMLElement).scrollTop);
    postCardListRef.current?.handleScroll(e);
  };

  return (
    <main
      className="flex-1 overflow-y-auto"
      onScroll={(e) => {
        handleScroll(e);
      }}
    >
      <PostGenreList scrollTop={scrollTop} />
      {userInfo && !userChecking ? (
        <PostCardList ref={postCardListRef} />
      ) : (
        <Spinner color="amber" className="m-auto mt-64 h-12 w-12" />
      )}
    </main>
  );
};

// Main App component
const Home: React.FC = () => {
  const { toggleTheme: initTheme } = useTheme();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <Sidebar />
      <Main />
    </>
  );
};

export default Home;
