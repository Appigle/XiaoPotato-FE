import React, { useEffect, useState } from 'react';
import './ProfileIndex.css';
import EditProfileModal from '@/components/EditProfileModal';
import { type_res_user_profile, type_req_update_profile } from '@/@types/request/XPotato';
import xPotatoApi from '@/Api/xPotatoApi';

const mockProfile: type_res_user_profile = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  userAccount: 'johndoe',
  userAvatar: 'https://i.pravatar.cc/300',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  gender: 'male',
  userRole: 'user',
  status: 1,
  token: 'mock-token',
  followingsCount: 20,
  followersCount: 10,
  commentsCount: 30,
  bio: 'Passionate about technology and life. Full-stack developer skilled in React and Node.js. Always exploring new technologies. Coffee enthusiast and amateur photographer in my free time.',
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<type_res_user_profile | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      //暂时先查看模拟数据，后续再调用以上接口
      await new Promise((resolve) => setTimeout(resolve, 1000)); //模拟请求延迟
      setProfile(mockProfile);
      // Ziqi API
      // const response = await xPotatoApi.getUserProfile();
      // if (response.data.code === 0) {
      //   setProfile(response.data.data);
      // } else {
      //   console.error('Failed to fetch profile:', response.data.message);
      // }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEditProfile = () => {
    setIsOpenModal(true);
  };

  const handleUpdateProfile = async (updatedProfile: type_req_update_profile) => {
    try {
      const response = await xPotatoApi.updateUserProfile(updatedProfile);
      if (response.data.code === 0) {
        fetchProfile(); // 重新获取更新后的profile
        setIsOpenModal(false);
      } else {
        console.error('Failed to update profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <main className="page-content">
      <section className="relative block h-[500px]">
        <div
          className="absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
          }}
        >
          <span id="blackOverlay" className="absolute h-full w-full bg-black opacity-50"></span>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 top-auto h-[70px] w-full overflow-hidden"
          style={{ transform: 'translateZ(0)' }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="bg-blueGray-200 relative py-16">
        <div className="container mx-auto px-4">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative">
                    <img
                      alt="Profile"
                      src={profile.userAvatar || 'default-avatar.png'}
                      className="absolute -m-16 -ml-20 h-auto max-w-[150px] rounded-full border-none align-middle shadow-xl lg:-ml-16"
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                  <div className="mt-32 px-3 py-6 sm:mt-0">
                    <button
                      className="mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600 sm:mr-2"
                      onClick={onEditProfile}
                      type="button"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="w-full px-4 lg:order-1 lg:w-4/12">
                  <div className="flex justify-center py-4 pt-8 lg:pt-4">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {profile.followingsCount}
                      </span>
                      <span className="text-blueGray-400 text-sm">Followings</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {profile.followersCount}
                      </span>
                      <span className="text-blueGray-400 text-sm">Followers</span>
                    </div>
                    <div className="p-3 text-center lg:mr-4">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {profile.commentsCount}
                      </span>
                      <span className="text-blueGray-400 text-sm">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-blueGray-700 mb-2 text-4xl font-semibold leading-normal">
                  {`${profile.firstName} ${profile.lastName}`}
                </h3>
                <div className="text-blueGray-400 mb-2 mt-0 text-sm font-bold uppercase leading-normal">
                  <i className="fas fa-map-marker-alt text-blueGray-400 mr-2 text-lg"></i>
                  {profile.userAccount}
                </div>
                <div className="text-blueGray-600 mb-2 mt-0 text-sm font-bold leading-normal">
                  {profile.email} | {profile.phone}
                </div>
              </div>
            </div>
            <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 lg:w-9/12">
                  <p className="text-blueGray-700 mb-4 text-lg leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditProfileModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </main>
  );
};

export default ProfilePage;
