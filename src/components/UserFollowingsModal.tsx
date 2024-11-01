import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { type_res_user_login } from '@src/@types/typeRequest';
import Api from '@src/Api';
import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';

interface UserFollowingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: type_res_user_login;
}
function UserFollowingsModal({ isOpen, setIsOpen }: UserFollowingsModalProps) {
  const [followingsList, setFollowingsList] = useState<type_res_user_login[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});

  const handleClose = () => {
    setIsOpen(false);
    // 清理状态
    setFollowingsList([]);
    setCurrentPage(1);
    setLoadingStates({});
  };

  const followHandler = async (userId: number, index: number) => {
    if (loadingStates[userId]) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));

      const res = await Api.xPotatoApi.followUser({ id: userId });

      if (res.code === 200) {
        setFollowingsList((prevList) => {
          const newList = [...prevList];
          newList[index] = {
            ...newList[index],
            followed: res.data,
          };
          return newList;
        });
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const loadFollowings = async () => {
    try {
      const response = await Api.xPotatoApi.getUserFollowings({
        currentPage,
        pageSize: 10,
      });
      setFollowingsList(response.data.records);
    } catch (error) {
      console.error('Failed to load followings:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFollowings();
    }
  }, [currentPage, isOpen]);

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="flex items-center justify-center bg-gray-100 p-5"
    >
      <Card color="transparent" shadow={false} className="w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Following
          </Typography>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ul className="w-full">
            {followingsList.map((following, index) => (
              <li
                key={following.id}
                className="flex items-center justify-between gap-4 border-b border-gray-200 py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={following.userAvatar || defaultUserAvatar}
                    alt={`${following.firstName} ${following.lastName}`}
                    onError={(e) => {
                      e.currentTarget.src = defaultUserAvatar;
                    }}
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <Typography color="blue-gray" className="font-medium">
                      {following.firstName} {following.lastName}
                    </Typography>
                    <Typography color="gray" className="text-sm">
                      {following.userAccount}
                    </Typography>
                  </div>
                </div>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => followHandler(following.id, index)}
                  disabled={loadingStates[following.id]}
                  className="min-w-[90px]"
                >
                  {loadingStates[following.id] ? 'Loading...' : 'Unfollow'}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Dialog>
  );
}

export default UserFollowingsModal;
