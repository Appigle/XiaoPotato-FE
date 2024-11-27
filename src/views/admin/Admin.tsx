import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from '@material-tailwind/react';
import {
  XCircleIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import xPotatoApi from '@/Api/xPotatoApi';
import useGlobalStore from '@src/stores/useGlobalStore';
import useLoginCheck from '@src/utils/hooks/login';
import { useGoBack } from '@src/utils/hooks/nav';
import Toast from '@src/utils/toastUtils';
import { IUserItem } from '@src/@types/typeUserItem';

const Admin: React.FC = () => {
  const [checking] = useLoginCheck();
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [userBeingDeleted, setUserBeingDeleted] = useState<IUserItem | undefined>();

  const userInfo = useGlobalStore((s) => s.userInfo);
  const setHeaderConfig = useGlobalStore((s) => s.setHeaderConfig);
  const setIsLoading = useGlobalStore((s) => s.setIsLoading);
  const isLoading = useGlobalStore((s) => s.isLoading);

  const TABLE_HEAD = ['ID', 'Account', 'Name', 'Email', 'Role', 'Status', 'Actions'];

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await xPotatoApi.getAllUsers({
        currentPage: 0,
        pageSize: 0,
        searchName: '',
        userId: 0,
      });

      if (res.data?.records) {
        setUsers(res.data.records);
      }
    } catch (error) {
      Toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const userToBeDeleted = users.find((user) => user.id === userToDelete);
      setUserBeingDeleted(userToBeDeleted);

      await xPotatoApi.deleteUser(userToDelete);
      Toast.success('User deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
    } catch (error) {
      Toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
      setUserBeingDeleted(undefined);
    }
  };

  useEffect(() => {
    if (!checking && userInfo?.userRole === 'admin') {
      fetchUsers();
    }
  }, [checking, userInfo, fetchUsers]);

  useEffect(() => {
    setHeaderConfig({ hasSearch: false });
    return () => setHeaderConfig({ hasSearch: true });
  }, [setHeaderConfig]);

  const goBack = useGoBack();

  if (checking || userInfo?.userRole !== 'admin') {
    return null;
  }

  return (
    <main className="page-content min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className="fixed left-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-gray-100"
        onClick={() => goBack}
      >
        <ArrowLeftIcon className="h-5 w-5 text-blue-gray-900" />
      </div>

      <div className="p-8 pt-16">
        <Card className="h-full w-full shadow-xl">
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none bg-blue-gray-50 dark:bg-blue-gray-800"
          >
            <div className="mb-4 flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-1">
                  Users Management
                </Typography>
                <Typography color="gray" className="font-normal">
                  Manage all registered users
                </Typography>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center gap-2 bg-blue-500 shadow-blue-500/20"
                  size="sm"
                >
                  <UserGroupIcon strokeWidth={2} className="h-4 w-4" />
                  {users.length} Users
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-auto px-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors duration-200 hover:bg-blue-gray-50/50"
                    >
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {user.id}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {user.userAccount}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {`${user.firstName} ${user.lastName}`}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {user.email}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <div
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.userRole === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.userRole}
                        </div>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <div
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 0 ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        {user.id !== userInfo?.id && (
                          <Tooltip content="Delete User">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => {
                                setUserToDelete(user.id);
                                setUserBeingDeleted(user);
                              }}
                              className="hover:bg-red-50"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        <Dialog open={userToDelete !== null} handler={() => !isDeleting && setUserToDelete(null)}>
          <DialogHeader className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            Confirm Delete
          </DialogHeader>
          <DialogBody divider className="grid gap-4">
            <Typography color="gray" className="font-normal">
              Are you sure you want to delete the user{' '}
              <span className="font-bold">{userBeingDeleted?.userAccount}</span>? This action cannot
              be undone.
            </Typography>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              color="gray"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="red"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </main>
  );
};

export default Admin;
