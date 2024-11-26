// App.tsx or page component
import { Checkbox, IconButton, Typography } from '@material-tailwind/react';
import { typeEmailListRef } from '@src/@types/typePostItem';
import Api from '@src/Api';
import Popover from '@src/components/Popover';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import { Moon, RefreshCcw, Sun } from 'lucide-react';
import React, { useRef, useState } from 'react';
import EmailForm from './EmailForm';
import EmailList from './EmailList';

const EmailPage: React.FC = () => {
  const emailListRef = useRef<typeEmailListRef>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [cbChecked, setCbChecked] = useState(false);

  const handleDelete = async (emailId: number, showToast: boolean) => {
    try {
      const response = await Api.xPotatoApi.deleteEmail(emailId);

      if (response.code === HTTP_RES_CODE.SUCCESS) {
        showToast && Toast.success('Delete successfully!');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleSelectionChange = (selectedIds: Set<number>, selectAll: boolean) => {
    console.log('Selected emails:', Array.from(selectedIds));
    setTimeout(() => {
      if (selectAll) {
        setCbChecked(true);
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
      } else if (selectedIds.size > 0) {
        setCbChecked(false);
        selectAllRef.current && (selectAllRef.current.indeterminate = true);
      } else {
        setCbChecked(false);
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
      }
    }, 1);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };
  const onRefreshEmailList = () => {
    emailListRef.current && emailListRef.current.handleRefresh();
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    emailListRef.current && emailListRef.current.handleSelectAll(e.target.checked);
  };

  return (
    <div className="flex h-full w-full bg-gray-100 transition-colors duration-200 dark:bg-blue-gray-900/95">
      <div className="relative w-5/12 min-w-[340px] p-4">
        <div className="mb-4 flex w-full items-center justify-between">
          <Typography variant="h4" className="text-blue-gray-900 dark:text-gray-200">
            Inbox
            <Popover
              placement="right"
              popoverClassName="w-80"
              content="Use 'shiftKey' to select multiple E-mail."
              childProps={{ className: 'w-3 h-3 ml-1 align-bottom' }}
            />
          </Typography>
          <div className="flex items-center justify-center gap-1">
            <div className="flex cursor-pointer items-center justify-center">
              <label htmlFor="selectAll" className="text-blue-gray-900 dark:text-gray-200">
                Select All
              </label>
              <Checkbox
                crossOrigin={''}
                ref={selectAllRef}
                key={Math.random()}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                id="selectAll"
                checked={cbChecked}
                onChange={(e) => {
                  handleSelectAll(e);
                  setCbChecked(e.target.checked);
                }}
                className="h-4 w-4 border-blue-gray-900 dark:border-gray-200"
                color="blue"
              />
            </div>

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
          needSelect={true}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <EmailForm />
    </div>
  );
};

export default EmailPage;
