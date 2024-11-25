// App.tsx or page component
import { IconButton, Typography } from '@material-tailwind/react';
import Api from '@src/Api';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import EmailForm from './EmailForm';
import EmailList from './EmailList';

const EmailPage: React.FC = () => {
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

  return (
    <div className="flex h-full w-full bg-gray-100 transition-colors duration-200 dark:bg-blue-gray-900/95">
      <div className="w-3/7 min-w-[300px] p-4">
        <div className="mb-6 flex w-full items-center justify-between">
          <Typography variant="h4" className="text-blue-gray-900 dark:text-gray-200">
            Inbox
          </Typography>
          <IconButton
            variant="text"
            onClick={toggleDarkMode}
            className="text-blue-gray-900 dark:text-gray-200"
          >
            <Moon className="hidden h-5 w-5 dark:block" />
            <Sun className="block h-5 w-5 dark:hidden" />
          </IconButton>
        </div>

        <EmailList
          pageSize={15}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <EmailForm />
    </div>
  );
};

export default EmailPage;
