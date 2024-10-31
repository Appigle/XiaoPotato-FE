import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
} from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/alert';
import { typeTheme } from '@src/@types/typeTheme';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useEventBusStore from '@src/stores/useEventBusStore';
import useGlobalStore from '@src/stores/useGlobalStore';
import useTheme from '@src/utils/hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Sidebar component
const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentTheme, setCurrentTheme, resetToSystemTheme } = useTheme();
  const isDarkMode = useGlobalStore((s) => s.isDarkMode);
  const setIsOpenPostFormModal = useEventBusStore((s) => s.setIsOpenPostFormModal);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const onChangeTheme = (theme: typeTheme | 'system') => {
    if (theme !== 'dark' && theme !== 'light') {
      resetToSystemTheme();
    } else {
      setCurrentTheme(theme);
    }
  };

  const [iconColor, setIconColor] = useState(() => {
    return 'white';
  });

  useEffect(() => {
    setIconColor(isDarkMode ? 'white' : 'black');
  }, [isDarkMode]);

  const openPostModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsOpenPostFormModal(true);
  };

  const onLogout = () => {
    localStorage.removeItem(X_ACCESS_TOKEN);
    navigate('/');
  };

  return (
    <div
      className={`bg-gray-100 text-gray-900 shadow-md transition-all duration-300 dark:bg-blue-gray-900 dark:text-white ${isExpanded ? 'w-56' : 'w-16'} flex flex-col justify-between`}
    >
      <nav className="p-4">
        <ul>
          <li className="mb-2 pl-2">
            <Link to="/discover" className="flex h-10 items-center justify-start transition-all">
              <IconButton variant="text" color={iconColor as color}>
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
            <a
              onClick={(e) => {
                openPostModal(e);
              }}
              className="flex h-10 cursor-pointer items-center justify-start transition-all"
            >
              <IconButton variant="text" color={iconColor as color}>
                <PlusCircleIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Post
                </span>
              )}
            </a>
          </li>
          <li className="mb-2 pl-2">
            <Link
              to="/notifications"
              className="flex h-10 items-center justify-start transition-all"
            >
              <IconButton variant="text" color={iconColor as color}>
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
              <IconButton variant="text" color={iconColor as color}>
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
              <IconButton variant="text" color={iconColor as color}>
                <EllipsisHorizontalIcon className="h-5 w-5" />
                ell
              </IconButton>
            </PopoverHandler>
          )}
          <PopoverContent className="bg-gray-300 text-gray-100 shadow-lg dark:bg-blue-gray-900 dark:text-gray-200">
            <ul className="space-y-2">
              <li>
                <Button variant="text" fullWidth className="text-blue-gray-900 dark:text-gray-200">
                  About XiaoPotato
                </Button>
              </li>
              <li>
                <Button variant="text" fullWidth className="text-blue-gray-900 dark:text-gray-200">
                  Privacy
                </Button>
              </li>
              <li>
                <Button variant="text" fullWidth className="text-blue-gray-900 dark:text-gray-200">
                  Help Service
                </Button>
              </li>
              <li>
                <Button variant="text" fullWidth className="text-blue-gray-900 dark:text-gray-200">
                  Setting
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-blue-gray-900 dark:text-gray-100">
                  {currentTheme === 'dark' ? '🌛' : '☀️'}
                </span>
                <ButtonGroup variant="gradient" size="sm">
                  <Button
                    onClick={() => onChangeTheme('light')}
                    color={iconColor as color}
                    title="Switch to light theme"
                    className={`text-lg ${currentTheme === 'dark' ? 'bg-gray-400' : 'bg-blue-gray-900'}`}
                  >
                    ☀️
                  </Button>
                  <Button
                    onClick={() => onChangeTheme('dark')}
                    color={iconColor as color}
                    title="Switch to dark theme"
                    className={`text-lg ${currentTheme === 'light' ? 'bg-gray-400' : 'bg-blue-gray-900'}`}
                  >
                    🌛
                  </Button>
                  <Button
                    onClick={() => onChangeTheme('system')}
                    color={iconColor as color}
                    title="Switch to system theme"
                    className="text-lg"
                  >
                    ⚙️
                  </Button>
                </ButtonGroup>
              </li>
              <li>
                <Button variant="text" color={iconColor as color} fullWidth onClick={onLogout}>
                  Logout
                </Button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <IconButton
          variant="text"
          color={iconColor as color}
          onClick={toggleSidebar}
          className="transition-all"
        >
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
export default Sidebar;
