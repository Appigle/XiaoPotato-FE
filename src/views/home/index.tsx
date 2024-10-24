import { ArtCardListRefType } from '@src/@types/artCard';
import ArtCardList from '@src/components/ArtCards/ArtCardList';
import ArtTypeList from '@src/components/ArtTypeList';
import { NavbarWithSearch } from '@src/components/NavbarWithSearch';
import Sidebar from '@src/components/Sidebar';
import useLoginCheck from '@src/utils/hooks/login';
import React, { useRef, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';

const Main: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const artCardListRef = useRef<ArtCardListRefType>(null);
  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    setScrollTop((e.target as HTMLElement).scrollTop);
    artCardListRef.current?.handleScroll(e);
  };
  return (
    <main
      className="flex-1 overflow-y-auto"
      onScroll={(e) => {
        handleScroll(e);
      }}
    >
      <ArtTypeList scrollTop={scrollTop} />
      <ArtCardList ref={artCardListRef} />
    </main>
  );
};

// Main App component
const App: React.FC = () => {
  useLoginCheck();
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
