import { EllipsisHorizontalCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from '@material-tailwind/react';
import allGenreList from '@src/constants/genreList';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import xiaoPotatoLogo from '/xiaoPotato.png';

export function NavbarWithSearch() {
  React.useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);
  const currentGenreItem = useGlobalStore((s) => s.currentGenreItem);
  const setCurrentPostType = useGlobalStore((s) => s.setCurrentPostType);
  const userDisplayName = useGlobalStore((s) => s.userDisplayName);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const onLogout = () => {
    localStorage.removeItem(X_ACCESS_TOKEN);
    navigate('/');
  };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-4">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="ml-4 flex items-center gap-x-1 p-1 font-medium"
      >
        <NavLink
          to="/profile"
          key="profile"
          className="flex flex-col items-center justify-center text-blue-gray-900 dark:text-gray-100"
        >
          <UserCircleIcon className="size-6" />
          {userDisplayName}
        </NavLink>
      </Typography>
      <Menu>
        <MenuHandler>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="flex cursor-pointer items-center gap-x-2 p-1 font-medium"
          >
            <EllipsisHorizontalCircleIcon className="size-8 text-blue-gray-900 dark:text-gray-100" />
          </Typography>
        </MenuHandler>
        <MenuList>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </ul>
  );

  return (
    <Navbar className="w-full !max-w-full !rounded-none border-none bg-gray-100 px-4 py-2 outline-none dark:bg-blue-gray-900">
      <div className="flex items-center justify-between text-blue-gray-900 dark:text-gray-100">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="ml-2 mr-4 flex cursor-pointer items-center justify-center gap-2 py-1.5"
        >
          <img src={xiaoPotatoLogo} alt="x-potato-logo" className="h-[50px] w-[50px]" />
          <span className="via-slate-200 inline-block bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text align-middle font-serif text-lg font-bold text-transparent">
            Share your gorgeous Art!
          </span>
        </Typography>
        <div className="hidden items-center lg:flex">
          <div className="relative flex w-full items-center justify-end md:w-max">
            <Menu open={openMenu} handler={setOpenMenu}>
              <MenuHandler>
                <Button
                  ripple={false}
                  variant="outlined"
                  size="sm"
                  className={`flex h-10 cursor-pointer flex-nowrap items-center gap-2 text-ellipsis rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3 capitalize text-blue-gray-900 dark:text-gray-100`}
                >
                  <span className="whitespace-nowrap">
                    {currentGenreItem.emoji} {currentGenreItem.name}
                  </span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-3.5 w-3.5 transition-transform ${openMenu ? 'rotate-180' : ''}`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="hidden max-h-72 w-20 lg:block">
                {allGenreList.map(({ name, emoji }) => (
                  <MenuItem
                    key={name}
                    className="hover:outline-none"
                    onClick={() => setCurrentPostType(name)}
                  >
                    <span
                      title={name}
                      className="flex max-w-fit items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {emoji} {name}
                    </span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Input
              type="search"
              crossOrigin="anonymous"
              placeholder="Search what your want..."
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              containerProps={{
                className: 'min-w-0',
              }}
              className="min-w-[300px] rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900 dark:text-gray-200 dark:focus:bg-blue-gray-400"
            />
            <Button size="md" className="m-2 rounded-lg">
              Search
            </Button>
          </div>
          <div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </IconButton>
            <div className="hidden lg:block">{navList}</div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
