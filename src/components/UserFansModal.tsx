import { Avatar, Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { type_res_user_login } from '@src/@types/typeRequest';
import Api from '@src/Api';
import { useEffect, useState } from 'react';
import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
interface UserFansModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: type_res_user_login;
}

function UserFansModal({ isOpen, setIsOpen }: UserFansModalProps) {
  const [fansList, setFansList] = useState<type_res_user_login[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const handleClose = () => {
    setIsOpen(false);
    setFansList([]);
    setCurrentPage(1);
    setLoadingStates({});
  };
  const followHandler = async (fanId: number, index: number) => {
    if (loadingStates[fanId]) return;

    try {
      // 设置loading状态
      setLoadingStates((prev) => ({ ...prev, [fanId]: true }));

      const res = await Api.xPotatoApi.followUser({ id: fanId });
      if (res.code === 200) {
        setFansList((preFans) => {
          const newFans = [...preFans];
          newFans[index] = { ...newFans[index], followed: res.data };
          return newFans;
        });
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [fanId]: false }));
    }
  };
  const loadFans = async () => {
    try {
      const res = await Api.xPotatoApi.getUserFans({ currentPage, pageSize: 10 });
      setFansList(res.data.records);
    } catch (error) {
      console.error('Failed to load fans:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFans();
    }
  }, [currentPage, isOpen]);

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="flex items-center justify-center bg-gray-100 p-5"
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Fans
        </Typography>
        <div className="flex flex-wrap items-center gap-4">
          <ul>
            {fansList.map((fan, index) => (
              <li key={fan.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={fan.userAvatar || defaultUserAvatar}
                    alt={`${fan.firstName} ${fan.lastName}`}
                    onError={(e) => {
                      e.currentTarget.src = defaultUserAvatar;
                    }}
                  />
                  <div className="flex flex-col">
                    <Typography color="blue-gray" className="font-medium">
                      {fan.firstName}
                      {''}
                      {fan.lastName}
                    </Typography>
                  </div>
                  <Button
                    size="sm"
                    color={fan.followed ? 'red' : 'light-blue'}
                    onClick={() => {
                      followHandler(fan.id, index);
                    }}
                    disabled={loadingStates[fan.id]}
                    className="min-w-[90px]"
                  >
                    {loadingStates[fan.id] ? 'Loading...' : fan.followed ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        Close
      </button>
    </Dialog>
  );
}

export default UserFansModal;
