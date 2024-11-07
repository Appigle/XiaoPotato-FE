import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-white/80 px-8 py-4 backdrop-blur-md">
        <div className="text-2xl font-bold text-gray-900">
          <a href="/" className="font-bold hover:text-pink-500">
            XiaoPotato
          </a>
        </div>
        <div className="flex gap-8">
          <a href="#about" className="text-gray-900 transition-colors hover:text-pink-500">
            About
          </a>
          <a href="#team" className="text-gray-900 transition-colors hover:text-pink-500">
            Team
          </a>
          <a href="#top" className="text-gray-900 transition-colors hover:text-pink-500">
            back to top
          </a>
        </div>
      </nav>

      {/* Background video */}
      <div className="fixed inset-0">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
          <source
            src="https://fe-video-qc.xhscdn.com/fe-platform/158ed48cadc8cc5ff56ee5c784f0f447de01c371.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* First screen: Masked text */}
      <div className="relative h-screen" id="top">
        <div
          className="fixed inset-0 bg-white"
          style={{
            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' alignment-baseline='middle' font-size='120px' font-weight='bold' fill='black'%3EShare Your Art%3C/text%3E%3C/mask%3E%3C/defs%3E%3Crect x='0' y='0' width='100%25' height='100%25' mask='url(%23mask)' fill='white'/%3E%3C/svg%3E")`,
            maskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' alignment-baseline='middle' font-size='120px' font-weight='bold' fill='black'%3EShare Your Art%3C/text%3E%3C/mask%3E%3C/defs%3E%3Crect x='0' y='0' width='100%25' height='100%25' mask='url(%23mask)' fill='white'/%3E%3C/svg%3E")`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center center',
            maskPosition: 'center center',
            opacity: Math.max(0, 1 - scrollY / windowHeight),
          }}
        />
      </div>

      {/* Second screen: Sliding text */}
      <div className="relative h-screen">
        <div
          className="flex h-screen items-center justify-center"
          style={{
            position: 'fixed',
            top: '50%',
            left: 0,
            right: 0,
            transform: `translate(0, ${Math.max(-50, 50 - (scrollY / windowHeight) * 100)}%)`,
            opacity: Math.min(1, Math.max(0, (scrollY / windowHeight) * 2 - 1)),
          }}
        >
          <h1 className="text-8xl font-bold text-white">Xiao Potato</h1>
        </div>
      </div>

      {/* Third screen: Content */}
      <div className="relative bg-white" id="about">
        <div className="mx-auto px-6 py-24">
          <div className="flex flex-col gap-16">
            {/* About Us Section */}
            <div className="flex flex-col justify-center gap-8 md:flex-row">
              <div className="flex items-center justify-center md:w-2/5">
                <h2 className="relative ml-4 inline-block text-5xl font-bold text-gray-900">
                  <span className="relative z-10">About Us</span>
                  <div
                    className="absolute -bottom-2 left-0 right-0 h-4 -rotate-1 bg-pink-100"
                    style={{ zIndex: 0 }}
                  />
                </h2>
              </div>
              <div className="md:w-3/5">
                <p className="text-lg leading-relaxed text-gray-600">
                  Xiao Potato is a vibrant art-sharing platform that connects artists and art
                  enthusiasts from around the world. Our platform provides a space where creators
                  can showcase their artistic journey, from traditional paintings to digital art,
                  photography, and beyond. We believe in the power of art to inspire, connect, and
                  transform lives through visual storytelling and creative expression.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="flex flex-col justify-center gap-8 pt-10 md:flex-row" id="team">
              <div className="flex items-center justify-center md:w-2/5">
                <h2 className="relative ml-4 inline-block text-5xl font-bold text-gray-900">
                  <span className="relative z-10">Our Team</span>
                  <div
                    className="absolute -bottom-2 left-0 right-0 h-4 -rotate-1 bg-pink-100"
                    style={{ zIndex: 0 }}
                  />
                </h2>
              </div>
              <div className="md:w-3/5">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Ray Chen</h3>
                    <p className="mt-2 text-gray-600">Creative Director</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Ziqi Feng</h3>
                    <p className="mt-2 text-gray-600">Technical Lead</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Mengyao Zhang</h3>
                    <p className="mt-2 text-gray-600">Community Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Milestones Section */}
        <div className="mx-auto px-6 py-24">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col">
              <div className="justify-center md:w-2/5">
                <h2 className="mb-16 flex flex-col items-center justify-center text-5xl font-bold text-gray-900">
                  <span className="relative z-10">Milestones</span>
                  <div
                    className="-mt-2 flex h-4 w-[272px] -rotate-1 bg-pink-100"
                    style={{ zIndex: 0 }}
                  />
                </h2>
              </div>
            </div>
            <div className="grid gap-16 md:grid-cols-3">
              {/* Milestone 1 */}
              <div className="relative flex flex-col items-center">
                <div className="mb-6 rounded-full bg-pink-50 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">September 2024</h3>
                <p className="text-center text-gray-600">
                  Formation of "Potatoers" team and inception of Xiao Potato art sharing platform
                  vision. A group of passionate creators came together to build a unique space for
                  artists.
                </p>
              </div>

              {/* Milestone 2 */}
              <div className="relative flex flex-col items-center">
                <div className="mb-6 rounded-full bg-pink-50 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">November 2024</h3>
                <p className="text-center text-gray-600">
                  Major development milestone achieved with successful frontend-backend integration
                  and implementation of real-time notification system.
                </p>
              </div>

              {/* Milestone 3 */}
              <div className="relative flex flex-col items-center">
                <div className="mb-6 rounded-full bg-pink-50 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">December 2024</h3>
                <p className="text-center text-gray-600">
                  Official release of Xiao Potato platform, featuring a comprehensive suite of tools
                  for artists to share, connect, and inspire through their creative work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Back to Home Button */}
      <div className="relative bg-white pb-24 pt-8 text-center">
        <a
          href="/xp/home"
          className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-8 py-3 text-lg font-medium text-gray-900 transition-all hover:bg-pink-100 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="translate-y-[1px]"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
