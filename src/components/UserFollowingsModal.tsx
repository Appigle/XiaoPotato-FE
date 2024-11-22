import { Avatar, Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { type_res_user_login } from '@src/@types/typeRequest';
import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
import { useEffect, useState } from 'react';
import xPotatoApi from '@src/Api/xPotatoApi';
import useGlobalStore from '@src/stores/useGlobalStore';
xPotatoApi;
interface UserFollowingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: type_res_user_login;
}
function UserFollowingsModal({ isOpen, setIsOpen, user }: UserFollowingsModalProps) {
  const [followingsList, setFollowingsList] = useState<type_res_user_login[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const handleClose = () => {
    setIsOpen(false);
    // 清理状态
    setFollowingsList([]);
    setCurrentPage(1);
    setLoadingStates({});
  };

  const followHandler = async (fanId: number, index: number) => {
    if (loadingStates[fanId]) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [fanId]: true }));

      const res = await xPotatoApi.followUser({ id: fanId });

      if (res.code === 200) {
        setFollowingsList((prevList) => {
          const newList = [...prevList];
          newList[index] = {
            ...newList[index],
            followed: res.data,
          };
          return newList;
        });
        if (userInfo) {
          const newFollowCount = res.data
            ? (userInfo.followCount || 0) + 1
            : (userInfo.followCount || 0) - 1;

          setUserInfo({ ...userInfo, followCount: newFollowCount });
        } else {
          throw new Error(res.message || 'follow action failed');
        }
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [fanId]: false }));
    }
  };

  const loadFollowings = async () => {
    try {
      const response = await xPotatoApi.getUserFollowings({
        userId: user.id,
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
  }, [currentPage, isOpen, user.id]);

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="flex items-center justify-center bg-gray-100 p-5 dark:bg-blue-gray-800"
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h5" color="blue-gray" className="mb-4 dark:text-blue-gray-200">
          Following
        </Typography>
        <div className="flex flex-col gap-6">
          {followingsList.length === 0 ? (
            <Typography color="gray" className="text-center dark:text-blue-gray-200">
              No Following yet
            </Typography>
          ) : (
            followingsList.map((fan, index) => (
              <div
                key={fan.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4 dark:text-blue-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={fan.userAvatar || defaultUserAvatar}
                    alt={`${fan.firstName} ${fan.lastName}`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = defaultUserAvatar;
                    }}
                    className="mr-3 size-10"
                  />
                  <div className="mr-8 flex flex-col">
                    <Typography color="blue-gray" className="font-medium dark:text-blue-gray-100">
                      {fan.firstName} {fan.lastName}
                    </Typography>
                    <Typography color="gray" className="text-sm dark:text-blue-gray-200">
                      {fan.userAccount}
                    </Typography>
                  </div>
                </div>
                <Button
                  size="sm"
                  color={fan.followed ? 'red' : 'light-blue'}
                  onClick={() => followHandler(fan.id, index)}
                  disabled={loadingStates[fan.id]}
                  className="min-w-[90px]"
                >
                  {loadingStates[fan.id] ? 'Loading...' : fan.followed ? 'Unfollow' : 'Follow'}
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="Close dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </Dialog>
  );
}

export default UserFollowingsModal;
