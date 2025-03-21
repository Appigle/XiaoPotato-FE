import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentTextIcon,
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
import Api from '@src/Api';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useEventBusStore from '@src/stores/useEventBusStore';
import useGlobalStore from '@src/stores/useGlobalStore';
import useTheme from '@src/utils/hooks/useTheme';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import { EggIcon, MailPlus, SpellCheck2, UsersIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zoom } from 'react-toastify';
import { useMediaQuery } from 'usehooks-ts';
import NotificationModal from './NotificationModal';
import PrivacyPolicy from './Privacy';

// Sidebar component
const Sidebar: React.FC = () => {
  const matches = useMediaQuery('(min-width: 768px)');
  const [isExpanded, setIsExpanded] = useState(matches);
  const { currentTheme, setCurrentTheme, resetToSystemTheme } = useTheme();
  const [notifyCount, setNotifyCount] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const isDarkMode = useGlobalStore((s) => s.isDarkMode);
  const setIsOpenPostFormModal = useEventBusStore((s) => s.setIsOpenPostFormModal);
  const setRefreshPostList = useEventBusStore((s) => s.setRefreshPostList);
  const navigate = useNavigate();
  const userInfo = useGlobalStore((s) => s.userInfo);
  const timerRef = useRef<number | null>();

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

  const discoveryPost = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setRefreshPostList(new Date().getTime());
  };

  const onLogout = () => {
    localStorage.removeItem(X_ACCESS_TOKEN);
    navigate('/');
  };

  const handleNotifyCount = () => {
    setNotifyCount(0);
  };

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  const getUnreadNotificationCount = useCallback(() => {
    if (!userInfo?.id) return;
    Api.xPotatoApi.getUserUnreadNotificationCount({ id: userInfo?.id as number }).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        setNotifyCount(res.data);
      }
    });
  }, [userInfo?.id]);

  useEffect(() => {
    getUnreadNotificationCount();
  }, [getUnreadNotificationCount]);

  return (
    <div
      className={`bg-gray-100 text-gray-900 shadow-md transition-all duration-300 dark:bg-blue-gray-900 dark:text-white ${isExpanded ? 'sm:w-46 md:w-56' : 'w-16'} flex flex-col justify-between`}
    >
      <nav className="p-4">
        <ul>
          <li className="mb-2 pl-2">
            <a
              onClick={(e) => {
                discoveryPost(e);
              }}
              className="flex h-10 cursor-pointer items-center justify-start transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
            >
              <IconButton variant="text" color={iconColor as color} title="Discovery">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Discovery
                </span>
              )}
            </a>
          </li>
          <li className="mb-2 pl-2">
            <a
              onClick={(e) => {
                openPostModal(e);
              }}
              className="flex h-10 cursor-pointer items-center justify-start transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
            >
              <IconButton variant="text" color={iconColor as color} title="Post">
                <PlusCircleIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Post
                </span>
              )}
            </a>
          </li>
          <li className="relative mb-2 pl-2">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleNotifyCount();
                setIsNotificationModalOpen(true);
              }}
              className="flex h-10 items-center justify-start transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
            >
              {notifyCount > 0 && (
                <div className="absolute left-[35px] top-[0px] z-10 flex h-5 w-fit min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 p-1 text-[10px] text-white">
                  {notifyCount > 99 ? '99+' : notifyCount}
                </div>
              )}
              <IconButton variant="text" color={iconColor as color} title="Notification">
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
              to="/xp/email"
              className="flex h-10 items-center justify-start overflow-hidden transition-all"
            >
              <IconButton variant="text" color={iconColor as color} title="Invitation">
                <MailPlus className="h-4 w-4" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Invitation
                </span>
              )}
            </Link>
          </li>
          <li className="mb-2 pl-2">
            <Link
              to="/about"
              className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
            >
              <IconButton variant="text" color={iconColor as color} title="About">
                <SpellCheck2 className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  About
                </span>
              )}
            </Link>
          </li>
          <li className="mb-2 pl-2">
            <Link
              to="/ielts"
              className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
            >
              <IconButton variant="text" color={iconColor as color} title="Ielts">
                <EggIcon className="h-5 w-5" />
              </IconButton>
              {isExpanded && (
                <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  Ielts
                </span>
              )}
            </Link>
          </li>
          {/*只在用户是 admin 时显示 */}
          {userInfo?.userRole === 'admin' ? (
            <>
              <li className="mb-2 pl-2">
                <Link
                  to="/admin/users"
                  className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
                >
                  <IconButton variant="text" color={iconColor as color} title="Manage Users">
                    <UsersIcon className="h-4 w-4" />
                  </IconButton>
                  {isExpanded && (
                    <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                      Manage Users
                    </span>
                  )}
                </Link>
              </li>
              <li className="mb-2 pl-2">
                <Link
                  to="/admin/posts"
                  className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
                >
                  <IconButton variant="text" color={iconColor as color} title="Manage Posts">
                    <DocumentTextIcon className="h-4 w-4" />
                  </IconButton>
                  {isExpanded && (
                    <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                      Manage Posts
                    </span>
                  )}
                </Link>
              </li>
            </>
          ) : (
            <li className="mb-2 pl-2">
              <Link
                to="/xp/profile"
                className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-gray-900/5 hover:dark:rounded-xl hover:dark:bg-gray-100/10"
              >
                <IconButton variant="text" color={iconColor as color} title="Me">
                  <UserCircleIcon className="h-5 w-5" />
                </IconButton>
                {isExpanded && (
                  <span className="ml-2 inline-block w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                    Me
                  </span>
                )}
              </Link>
            </li>
          )}
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
          <PopoverContent className="border border-blue-gray-200 bg-gray-100 text-gray-100 shadow-lg dark:bg-blue-gray-900 dark:text-gray-200">
            <ul className="space-y-2">
              <li>
                <Button
                  variant="text"
                  fullWidth
                  className="capitalize text-blue-gray-900 hover:rounded-xl hover:bg-blue-gray-100/10 hover:text-blue-gray-900 dark:text-gray-200"
                >
                  <Link to="/about"> About XiaoPotato</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="text"
                  fullWidth
                  className="capitalize text-blue-gray-900 hover:rounded-xl hover:bg-blue-gray-100/10 hover:text-blue-gray-900 dark:text-gray-200"
                  onClick={() => {
                    Toast(<PrivacyPolicy />, {
                      position: 'top-center',
                      autoClose: false,
                      progress: undefined,
                      transition: Zoom,
                      className: 'w-[600px] min-w-[40px]',
                    });
                  }}
                >
                  Privacy
                </Button>
              </li>
              <li>
                <Button
                  variant="text"
                  fullWidth
                  className="capitalize text-blue-gray-900 hover:rounded-xl hover:bg-blue-gray-100/10 hover:text-blue-gray-900 dark:text-gray-200"
                  onClick={() => {
                    Toast(
                      <div>
                        🦄 You can call{' '}
                        <a href="tel:+123456789" className="text-blue-500 underline">
                          +1 (666)-999-5678
                        </a>{' '}
                        to get our perfect service!
                      </div>,
                      {
                        position: 'top-center',
                        autoClose: false,
                        hideProgressBar: true,
                        progress: undefined,
                        transition: Zoom,
                        className: 'w-[500px] min-w-[40px]',
                      },
                    );
                  }}
                >
                  Help Service
                </Button>
              </li>
              <li>
                <Link
                  to="/xp/profile"
                  className="flex h-10 items-center justify-start overflow-hidden transition-all hover:rounded-xl hover:bg-blue-gray-100/10"
                >
                  <Button
                    variant="text"
                    fullWidth
                    className="capitalize text-blue-gray-900 dark:text-gray-200"
                  >
                    Setting
                  </Button>
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="mr-4 hidden text-blue-gray-900 dark:text-gray-100">
                  {currentTheme === 'dark' ? '🌛' : '☀️'}
                </span>
                <ButtonGroup variant="outlined" size="sm">
                  <Button
                    onClick={() => onChangeTheme('light')}
                    color={iconColor as color}
                    title="Switch to light theme"
                    className={`border-none bg-gray-100 text-lg outline-none focus:outline-none focus:ring-0 ${currentTheme === 'light' && 'cursor-not-allowed'}`}
                  >
                    ☀️
                  </Button>
                  <Button
                    onClick={() => onChangeTheme('dark')}
                    color={iconColor as color}
                    title="Switch to dark theme"
                    className={`border-none bg-blue-gray-900 text-lg outline-none focus:outline-none focus:ring-0 ${currentTheme === 'dark' && 'cursor-not-allowed'}`}
                  >
                    🌛
                  </Button>
                  <Button
                    onClick={() => onChangeTheme('system')}
                    color={iconColor as color}
                    title="Switch to system theme "
                    className={`border-none text-lg outline-none focus:outline-none focus:ring-0 ${currentTheme === 'light' ? 'bg-gray-100' : 'bg-blue-gray-900'}`}
                  >
                    ⚙️
                  </Button>
                </ButtonGroup>
              </li>
              <li>
                <Button
                  variant="text"
                  color={iconColor as color}
                  fullWidth
                  onClick={onLogout}
                  className="capitalize hover:rounded-xl hover:bg-blue-gray-100/10 hover:text-blue-gray-900 dark:text-gray-200"
                >
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
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
};
export default Sidebar;
