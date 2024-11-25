// App.tsx or page component
import { IconButton, Typography } from '@material-tailwind/react';
import { typeEmailListRef } from '@src/@types/typePostItem';
import Api from '@src/Api';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import { Moon, RefreshCcw, Sun } from 'lucide-react';
import React, { useRef } from 'react';
import EmailForm from './EmailForm';
import EmailList from './EmailList';

const EmailPage: React.FC = () => {
  const emailListRef = useRef<typeEmailListRef>(null);
  const handleDelete = async (emailId: number) => {
    try {
      const response = await Api.xPotatoApi.deleteEmail(emailId);

      if (response.code === HTTP_RES_CODE.SUCCESS) {
        Toast.success('Delete successfully!');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleSelectionChange = (selectedIds: Set<number>) => {
    console.log('Selected emails:', Array.from(selectedIds));
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };
  const onRefreshEmailList = () => {
    emailListRef.current && emailListRef.current.handleRefresh();
  };

  return (
    <div className="flex h-full w-full bg-gray-100 transition-colors duration-200 dark:bg-blue-gray-900/95">
      <div className="w-3/7 min-w-[340px] p-4">
        <div className="mb-6 flex w-full items-center justify-between">
          <Typography variant="h4" className="text-blue-gray-900 dark:text-gray-200">
            Inbox
          </Typography>
          <div className="flex items-center justify-center gap-1">
            <IconButton
              variant="text"
              onClick={onRefreshEmailList}
              className="text-blue-gray-900 dark:text-gray-200"
            >
              <RefreshCcw className="h-4 w-4 hover:animate-spin" />
            </IconButton>
            <IconButton
              variant="text"
              onClick={toggleDarkMode}
              className="text-blue-gray-900 dark:text-gray-200"
            >
              <Moon className="hidden h-5 w-5 dark:block" />
              <Sun className="block h-5 w-5 dark:hidden" />
            </IconButton>
          </div>
        </div>

        <EmailList
          ref={emailListRef}
          pageSize={10}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <EmailForm />
    </div>
  );
};

export default EmailPage;
