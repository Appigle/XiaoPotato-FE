import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import { typePostGenre } from '@src/@types/typePostItem';
import React, { useEffect, useRef, useState } from 'react';

interface ListItem {
  id: string;
  content: React.ReactNode | string;
}

interface HorizontalListProps {
  items: ListItem[];
  className?: string;
  activeStyle?: React.CSSProperties;
  inActiveStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  activeId?: string;
  onItemClick?: (id: typePostGenre) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const HorizontalList: React.FC<HorizontalListProps> = ({
  items = [],
  className = '',
  activeStyle = { color: 'blue' },
  inActiveStyle = { color: 'black' },
  textStyle = { color: 'white' },
  activeId = 'All',
  onItemClick,
}) => {
  const [visibleItems, setVisibleItems] = useState<ListItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<ListItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let currentWidth = 0;
      const visible: ListItem[] = [];
      const hidden: ListItem[] = [];

      items.forEach((item) => {
        const itemElement = itemsRef.current.get(item.id as string);
        const itemWidth = itemElement?.offsetWidth || 120;

        if (currentWidth + itemWidth + (hidden.length === 0 ? 0 : 140) <= containerWidth) {
          visible.push(item);
        } else {
          if (hidden.length === 0) {
            const i = visible.splice(-1, 1)[0];
            i && hidden.push(i);
          }
          hidden.push(item);
        }
        currentWidth += itemWidth;
      });

      setVisibleItems(visible);
      setHiddenItems(hidden);
    };

    const timer = setTimeout(() => {
      calculateVisibleItems();
    }, 500);
    window.addEventListener('resize', calculateVisibleItems);

    return () => {
      window.removeEventListener('resize', calculateVisibleItems);
      clearTimeout(timer);
    };
  }, [items]);

  const renderItem = (item: ListItem) => (
    <Button
      variant="text"
      key={item.id}
      ref={(el) => {
        if (el) itemsRef.current.set(item.id, el);
      }}
      className={`} flex w-fit min-w-fit items-center gap-2 !border-none text-base !font-normal !normal-case text-gray-400 outline-none transition-all hover:border-0 hover:border-none hover:outline-none focus:border-none focus:outline-none`}
      style={{ ...textStyle, ...(activeId === item.id ? activeStyle : inActiveStyle) }}
      onClick={() => onItemClick?.(item.id as unknown as typePostGenre)}
      title={`item.id:${item.id}, activeId: ${activeId}`}
    >
      <span
        className={`${item.id === activeId ? 'inline-block bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text align-middle text-transparent' : ''}`}
      >
        {item.content}
      </span>
    </Button>
  );

  return (
    <div ref={containerRef} className={`flex items-center space-x-1 ${className} pl-2`}>
      {visibleItems.map(renderItem)}

      {hiddenItems.length > 0 && (
        <Menu>
          <MenuHandler>
            <Button
              variant="text"
              className={`flex items-center gap-2 text-base !font-normal !normal-case text-gray-400 outline-none hover:text-white`}
              style={textStyle}
            >
              More <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </MenuHandler>
          <MenuList className="border-gray-800 bg-gray-900">
            {hiddenItems.map((item) => (
              <MenuItem
                key={item.id}
                className={`px-4 py-2 text-white hover:bg-gray-800`}
                onClick={() => onItemClick?.(item.id as unknown as typePostGenre)}
              >
                <span
                  className={`${item.id === activeId ? 'inline-block bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text align-middle text-transparent' : ''}`}
                >
                  {item.content}
                </span>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </div>
  );
};

export default HorizontalList;
