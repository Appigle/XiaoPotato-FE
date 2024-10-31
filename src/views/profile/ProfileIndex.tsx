import xPotatoApi from '@/Api/xPotatoApi';
import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import EditProfileModal from '@/components/EditProfileModal';
import {
  type_req_update_profile,
  type_res_user_profile,
  user_profile,
} from '@src/@types/typeRequest';
import { NavbarWithSearch } from '@src/components/NavbarWithSearch';
import ToastContainer from '@src/components/ToastContainer';
import useGlobalStore from '@src/stores/useGlobalStore';
import useLoginCheck from '@src/utils/hooks/login';
import { useGoBack } from '@src/utils/hooks/nav';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileIndex.css';

const ProfilePage: React.FC = () => {
  useLoginCheck();
  const [profile, setProfile] = useState<type_res_user_profile | null | undefined>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  //global state
  const userInfo = useGlobalStore((s) => s.userInfo);

  const setUserInfo = useGlobalStore((s) => s.setUserInfo);
  const setIsLoading = useGlobalStore((s) => s.setIsLoading);
  const isLoading = useGlobalStore((s) => s.isLoading);

  // 从 profile 或 defaultUserAvatar 获取头像
  const [userAvatar, setUserAvatar] = useState(() => {
    return userInfo?.userAvatar || defaultUserAvatar;
  });

  const goBack = useGoBack();
  const navigate = useNavigate();
  const handleViewPosts = () => {
    navigate(`/profile/${profile?.id}/posts`);
  };
  useEffect(() => {
    if (userInfo) {
      setProfile(userInfo);
      setUserAvatar(userInfo.userAvatar || defaultUserAvatar);
    }
  }, [userInfo]);

  const onEditProfile = () => {
    setIsOpenModal(true);
  };

  const handleUpdateProfile = async (updatedProfile: type_req_update_profile) => {
    try {
      setIsLoading(true);
      const response = await xPotatoApi.updateUserProfile(updatedProfile);
      if (response.code === 200 && response.data === true) {
        const updatedUserInfo: user_profile = {
          ...userInfo!,
          ...updatedProfile,
        };
        // 更新全局状态
        setUserInfo(updatedUserInfo);

        // 更新本地状态
        setProfile(updatedUserInfo);

        // 关闭模态框
        setIsOpenModal(false);
        setUserInfo(updatedUserInfo);

        // 添加成功提示
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', response.message);
        alert(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setUserAvatar(defaultUserAvatar);
  };

  if (isLoading || !userInfo) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <main className="page-content">
      <ToastContainer />
      <NavbarWithSearch search={false} />
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
          className="absolute left-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full p-1 hover:bg-gray-200"
          onClick={() => goBack()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
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
                      onError={handleImageError}
                      src={userAvatar}
                      className="absolute -m-16 -ml-20 h-auto max-w-[150px] rounded-full border-none align-middle shadow-xl lg:-ml-16"
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                  <div className="mt-32 px-3 py-6 sm:mt-0">
                    <button
                      className="mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600 sm:mr-2"
                      onClick={handleViewPosts}
                      type="button"
                    >
                      View Posts
                    </button>
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
                        {profile.followCount || 568}
                      </span>
                      <span className="text-blueGray-400 text-sm">Followings</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {profile.fansCount || 687}
                      </span>
                      <span className="text-blueGray-400 text-sm">Followers</span>
                    </div>
                    <div className="p-3 text-center lg:mr-4">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {profile.commentsCount || 873}
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
                  {profile.email || 'xiao-potato@gmail.com'} |{' '}
                  {profile.phone || '+1 (589)-455-6555'}
                </div>
              </div>
            </div>
            <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 lg:w-9/12">
                  <p className="text-blueGray-700 mb-4 text-lg leading-relaxed">
                    {profile.description}
                  </p>
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
