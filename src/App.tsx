import { Button } from '@material-tailwind/react';
import '@src/styles/reset.css';
import '@src/styles/starry.scss';
import '@src/styles/tailwind.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { IndexMenu } from './@types/common';
import './App.css';
import CityWeather from './components/CityWeather';
import CountTimer from './components/CountTimer';
import { indexMenuList } from './constants/constants';
import githubMark from '/github-mark.png';
import xiaoPotato from '/xiaoPotato.png';
import { LoginModal } from '@src/components/LoginModal';
import { RegisterModal } from '@src/components/RegisterModal';

function App() {
  const { t } = useTranslation();
  const [menu] = useState<IndexMenu[]>(indexMenuList);
  const [count, setCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const handleLoginClick = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
  };

  return (
    <div className="page-content">
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
          <h1 className="via-slate-200 my-4 inline-block bg-gradient-to-r from-pink-600 to-yellow-400 bg-clip-text font-bold text-transparent">
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
              <Button className="w-fit px-4 py-2" onClick={() => setCount((count) => count + 1)}>
                Click count is {count}
              </Button>
              <Button className="w-fit px-4 py-2" onClick={handleLoginClick}>
                Login
              </Button>
              <Button className="w-fit px-4 py-2" onClick={handleSignUpClick}>
                Sign Up
              </Button>
            </div>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="absolute bottom-14 text-white">
            &#169; 2024, M,Y/Z,Q/L,C Welcome the Xiao Potato World!
            <a
              href="https://github.com/Appigle/XiaoPotato-FE"
              target="_blank"
              className="bg-slate-500 mx-4 inline-block h-6 w-6 rounded-full"
            >
              <img src={githubMark} alt="Github mark" width="32px" height="32px" />
            </a>
          </p>
        </div>
      </div>
      <LoginModal
        open={isLoginOpen}
        setOpen={setIsLoginOpen}
        openSignUp={() => {
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
    </div>
  );
}

export default App;
