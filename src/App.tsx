import '@src/styles/reset.css';
import '@src/styles/starry.scss';
import '@src/styles/tailwind.css';
import { useState } from 'react';
import './App.css';
import githubMark from '/github-mark.png';
import xiaoPotato from '/xiaoPotato.png';

function App() {
  const [count, setCount] = useState(0);

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
          <h1 className="my-4 inline-block bg-gradient-to-r from-pink-600 via-slate-200 to-yellow-400 bg-clip-text font-bold text-transparent">
            Xiao Potato Art Platform
          </h1>
          <div className="my-4 flex flex-col items-center justify-center gap-4">
            <button className="w-fit px-4 py-2" onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <button className="w-fit px-4 py-2" onClick={() => alert('Login -> TODO')}>
              Login
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="absolute bottom-14">
            &#169; 2024, M,Y/Z,Q/L,C Welcome the Xiao Potato World!
            <a
              href="https://github.com/Appigle/XiaoPotato-FE"
              target="_blank"
              className="mx-4 inline-block h-6 w-6 rounded-full bg-slate-500"
            >
              <img src={githubMark} alt="Github mark" width="32px" height="32px" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
