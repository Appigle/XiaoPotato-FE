import { Button } from '@material-tailwind/react';
import { LoginModal } from '@src/components/LoginModal';
import { RegisterModal } from '@src/components/RegisterModal';
import '@src/styles/reset.css';
import '@src/styles/starry.scss';
import '@src/styles/tailwind.css';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { typeNavMenuItem } from './@types/common';
import './App.css';
import CityWeather from './components/CityWeather';
import CountTimer from './components/CountTimer';
import KeyPressNotice from './components/KeyPressNotice';
import ToastContainer from './components/ToastContainer';
import Key from './constants/keyboard';
import useLoginCheck from './utils/hooks/login';
import useTheme from './utils/hooks/useTheme';
import Toast from './utils/toastUtils';
import githubMark from '/github-mark.png';
import xiaoPotato from '/xiaoPotato.png';

function App() {
  useLoginCheck();
  const { t } = useTranslation();
  const [menu] = useState<typeNavMenuItem[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isRun, setIsRun] = useState(true);
  const [keyPressInfo, setKeyPressInfo] = useState({ count: 0, key: Key.ArrowUp });
  const [god] = useState(
    () => URLSearchParams && new URLSearchParams(window.location.search).get('god'),
  );
  const [firework] = useState(
    () => URLSearchParams && new URLSearchParams(window.location.search).get('firework'),
  );

  useEffect(() => {
    setTimeout(() => {
      setIsRun(false);
    }, 4000);
  }, []);

  const { toggleTheme: initTheme } = useTheme();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const handleLoginClick = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const handleGuestLoginClick = () => {
    setIsGuest(true);
    setIsAdmin(false);
    setIsLoginOpen(!isLoginOpen);
  };
  const handleAdminLogin = () => {
    setIsGuest(false);
    setIsAdmin(true);
    setIsLoginOpen(!isLoginOpen);
  };
  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
  };

  useHotkeys(`${Key.ArrowUp}+${Key.ArrowUp}+${Key.ArrowUp}`, () => {
    let valid = false;
    if (keyPressInfo.key === Key.ArrowUp) {
      const count = keyPressInfo.count + 1;
      valid = count > 3 ? true : false;
      setKeyPressInfo({ ...keyPressInfo, count: count > 3 ? 1 : count });
    } else {
      setKeyPressInfo({ key: Key.ArrowUp, count: 1 });
    }
    valid && setIsRun(false);
  });
  useHotkeys(`${Key.ArrowDown}+${Key.ArrowDown}+${Key.ArrowDown}`, () => {
    let valid = false;
    if (keyPressInfo.key === Key.ArrowDown) {
      const count = keyPressInfo.count + 1;
      valid = count > 3 ? true : false;
      setKeyPressInfo({ ...keyPressInfo, count: count > 3 ? 1 : count });
    } else {
      setKeyPressInfo({ key: Key.ArrowDown, count: 1 });
    }
    valid && setIsRun(true);
  });

  const goToFirework = () => {
    Number(firework) > 0 &&
      window.location.replace(
        `https://www.xiaopotato.top/fireworks?year=${new Date().getFullYear() + 1}`,
      );
  };

  const isGodMode = () => {
    if (god?.toLocaleLowerCase() === 'ray') {
      Toast(`Welcome, God ${god}!`);
      setTimeout(() => {
        handleAdminLogin();
      }, 1000);
    }
  };

  useEffect(() => {
    goToFirework();
    isGodMode();
  }, []);

  return (
    <div className="page-content">
      <ToastContainer />
      <KeyPressNotice />
      <div className="star-wrapper overflow-hidden">
        <div className="star" id="star-1"></div>
        <div className="star" id="star-2"></div>
        <div className="star" id="star-3"></div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div>
            <a href="https://github.com/Appigle/XiaoPotato-FE" target="_blank">
              <img src={xiaoPotato} className="my-4 h-32 w-32" alt="xiaoPotato logo" />
            </a>
          </div>
          <h1
            onClick={() => toast('Welcome to Potato art world!')}
            className="via-slate-200 my-4 inline-block bg-gradient-to-r from-pink-600 to-yellow-400 bg-clip-text p-4 text-6xl font-bold text-transparent"
          >
            {t('XiaoPotatoArtPlatform')}
          </h1>
          <div>
            <CountTimer />
            <CityWeather />
          </div>
          <div className="flex h-fit items-center justify-center py-2 text-lg">
            {menu.map((item) => {
              return item.redirect ? (
                <Link key={item.path} reloadDocument className="p-2 text-blue-500" to={item.path}>
                  {item.name}
                </Link>
              ) : (
                <NavLink
                  to={item.path}
                  key={item.path}
                  className={({ isActive }) =>
                    [isActive ? 'text-blue-500' : 'text-blue-300', 'p-2'].join(' ')
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          <div className="my-4 flex flex-col items-center justify-center gap-4">
            <div className="flex justify-center gap-4">
              <Button className="w-fit px-4 py-2" onClick={handleLoginClick}>
                Login
              </Button>
              <Button className="w-fit px-4 py-2" onClick={handleSignUpClick}>
                Sign Up
              </Button>
              <Button className="w-fit px-4 py-2" onClick={handleGuestLoginClick}>
                Guest
              </Button>
              <Button className="w-fit px-4 py-2">
                <Link
                  key="Fireworks"
                  reloadDocument
                  className="p-2 text-blue-500"
                  to="https://www.xiaopotato.top/fireworks/"
                >
                  Happy New Year! 🎆
                </Link>
              </Button>
            </div>
          </div>
          <p className="mt-10">
            <span className="ml-4 text-blue-gray-500 opacity-70">
              Press{' '}
              {new Array(4).fill('❥(^_-)').map((_, index) => {
                return (
                  <kbd
                    key={index}
                    className={`rounded-lg bg-blue-gray-100/10 px-2 py-1.5 text-xl font-bold text-white dark:bg-blue-gray-900 dark:text-white ${index != 0 ? 'ml-1' : ''}`}
                  >
                    {!isRun ? '↓' : '↑'}
                  </kbd>
                );
              })}
              {isRun ? ' to pause' : ' to start'}
            </span>
          </p>
          <p className="absolute bottom-14 mt-4 whitespace-normal p-4 text-[12] text-gray-200 sm:text-xs">
            &#169; 2024, <span onDoubleClick={handleAdminLogin}>Z,MY/F,ZQ/C,L</span> Welcome the
            XiaoPotato World!
            <a
              href="https://github.com/Appigle/XiaoPotato-FE"
              target="_blank"
              className="bg-slate-500 m-t-2 mx-4 inline-block h-6 w-6 rounded-full bg-gray-400"
            >
              <img src={githubMark} alt="Github mark" width="32px" height="32px" />
            </a>
          </p>
        </div>
      </div>
      <LoginModal
        open={isLoginOpen}
        isGuest={isGuest}
        isAdmin={isAdmin}
        setOpen={(b) => {
          setIsLoginOpen(b);
          setIsGuest(false);
          setIsAdmin(false);
        }}
        openSignUp={() => {
          setIsGuest(false);
          setIsAdmin(false);
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <RegisterModal
        open={isSignUpOpen}
        setOpen={setIsSignUpOpen}
        openLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
      {isRun && <Confetti />}
    </div>
  );
}

export default App;
