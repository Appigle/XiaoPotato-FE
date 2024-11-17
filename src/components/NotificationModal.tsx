import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Button,
  Typography,
  Spinner,
} from '@material-tailwind/react';
import { format } from 'date-fns';
import xPotatoApi from '@src/Api/xPotatoApi';
import { BellIcon } from 'lucide-react';
import { NotificationItem } from '@src/@types/typeRequest';
import { XMarkIcon } from '@heroicons/react/24/outline';
import defaultUserAvatar from '@/assets/MonaLisaAvatar.png';
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const PAGE_SIZE = 10;

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (page: number) => {
    setLoading(true);
    try {
      const response = await xPotatoApi.getNotifications({
        currentPage: page,
        pageSize: PAGE_SIZE,
      });
      console.log('Response data:', response.data);
      if (response.data) {
        setNotifications(response.data.records);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(currentPage);
    }
  }, [isOpen, currentPage]);

  const getNotificationText = (notifications: NotificationItem) => {
    switch (notifications.notificationType) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'save':
        return 'saved your post';
      default:
        return 'interacted with you';
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Dialog open={isOpen} handler={onClose} className="sm:max-w-[500px]">
      <DialogHeader className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          <Typography variant="h5">Notifications</Typography>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </DialogHeader>

      <DialogBody className="max-h-[60vh] overflow-y-auto p-0">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <Typography className="text-gray-500">No notifications yet</Typography>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.sourceId}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Avatar
                  src={notification.avatar || defaultUserAvatar}
                  alt={`${notification.firstName} ${notification.lastName}`}
                  className="h-10 w-10"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <Typography className="font-semibold">
                      {notification.firstName} {notification.lastName}
                    </Typography>
                    <Typography className="text-sm text-gray-500">
                      {format(new Date(notification.timestamp), 'MMM d, yyyy')}
                    </Typography>
                  </div>
                  <Typography className="text-sm">{getNotificationText(notification)}</Typography>
                  {notification.content && (
                    <Typography className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {notification.content}
                    </Typography>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogBody>

      {totalPages > 1 && (
        <DialogFooter className="flex justify-center border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <Typography className="flex items-center">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </DialogFooter>
      )}
    </Dialog>
  );
};

export default NotificationModal;
