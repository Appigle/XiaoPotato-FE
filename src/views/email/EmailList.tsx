// types.ts

interface EmailListState {
  status: 'idle' | 'loading' | 'error' | 'success';
  error?: string;
  data: typeEmail[];
  totalPages: number;
}

interface ContextMenuPosition {
  x: number;
  y: number;
  emailId: number | null;
}

// EmailList.tsx
import {
  Alert,
  ButtonGroup,
  Card,
  Checkbox,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@material-tailwind/react';
import { typeEmail } from '@src/@types/common';
import { typeEmailListRef } from '@src/@types/typePostItem';
import Api from '@src/Api';
import useEventBusStore from '@src/stores/useEventBusStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

interface EmailListProps {
  pageSize?: number;
  needSelect?: boolean;
  onDelete?: (emailId: number) => Promise<void>;
  onSelectionChange?: (selectedIds: Set<number>) => void;
}

const EmailList = forwardRef<typeEmailListRef, EmailListProps>(
  ({ pageSize = 10, needSelect = false, onDelete, onSelectionChange }, ref) => {
    const { setCurrentEmailDetail } = useEventBusStore();
    const [state, setState] = useState<EmailListState>({
      status: 'idle',
      data: [],
      totalPages: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
    const [contextMenu, setContextMenu] = useState<ContextMenuPosition>({
      x: 0,
      y: 0,
      emailId: null,
    });

    const fetchEmails = useCallback(
      async (curPage: number = 1) => {
        try {
          setState((prev) => ({ ...prev, status: 'loading' }));

          const response = await Api.xPotatoApi.getEmailByPage({ currentPage: curPage, pageSize });

          if (response.code !== HTTP_RES_CODE.SUCCESS) {
            return;
          }
          setState({
            status: 'success',
            data: response.data.records,
            totalPages: response.data.pages,
          });
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') return;

          setState((prev) => ({
            ...prev,
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to fetch emails',
          }));
        }
      },
      [pageSize],
    );

    useEffect(() => {
      fetchEmails(currentPage);
    }, [currentPage, fetchEmails]);

    useEffect(() => {
      const handleClickOutside = () => setContextMenu({ x: 0, y: 0, emailId: null });
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent, emailId: number) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        emailId,
      });
    }, []);

    const handleDeleteEmail = async (emailId: number) => {
      try {
        if (onDelete) {
          await onDelete(emailId);
          fetchEmails();
        }
      } catch (error) {
        console.error('Failed to delete email:', error);
      } finally {
        setContextMenu({ x: 0, y: 0, emailId: null });
      }
    };

    const toggleEmailSelection = (emailId: number) => {
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        if (next.has(emailId)) {
          next.delete(emailId);
        } else {
          next.add(emailId);
        }
        onSelectionChange?.(next);
        return next;
      });
    };

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      } catch {
        return 'Invalid date';
      }
    };

    const handleDetail = (e: typeEmail) => {
      setCurrentEmailDetail(e);
    };

    const handleRefresh = () => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchEmails(1);
      }
    };

    useImperativeHandle(ref, () => ({
      handleRefresh,
    }));

    const renderEmailItem = (email: typeEmail) => (
      <ListItem
        ripple={false}
        key={email.emailId}
        className={`cursor-pointer border-b-2 border-b-blue-gray-200 bg-gray-100 text-blue-gray-900 transition-colors duration-200 hover:bg-gray-300 dark:bg-blue-gray-900/20 dark:text-gray-200 dark:hover:bg-blue-gray-800`}
        onContextMenu={(e) => handleContextMenu(e, email.emailId)}
        onClick={() => handleDetail(email)}
      >
        <div className="flex w-full items-center gap-4 px-4 py-2">
          {needSelect && (
            <div
              className={`transition-opacity duration-200 ${selectedEmails.has(email.emailId) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} `}
            >
              <Checkbox
                crossOrigin={''}
                checked={selectedEmails.has(email.emailId)}
                onChange={() => toggleEmailSelection(email.emailId)}
                className="h-5 w-5 dark:border-gray-200"
                color="blue"
              />
            </div>
          )}

          <div className="min-w-0 flex-grow">
            <div className="flex items-baseline justify-between">
              <Typography
                variant="h6"
                className="mr-2 truncate font-semibold text-blue-gray-900 dark:text-gray-200"
                title={email.toUser}
              >
                {email.toUser}
              </Typography>
              <Typography
                className="whitespace-nowrap text-sm text-gray-700 dark:text-gray-400"
                title={email.createTime}
              >
                {formatDate(email.createTime)}
              </Typography>
            </div>
            <Typography
              className="truncate text-sm font-medium text-blue-gray-900 dark:text-gray-200"
              title={email.subject}
            >
              {email.subject}
            </Typography>
            <Typography
              className="truncate text-sm text-gray-700 dark:text-gray-400"
              title={email.content}
            >
              {email.content}
            </Typography>
          </div>

          <div className="absolute right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => handleDeleteEmail(email.emailId)}
              className="text-gray-700 hover:bg-red-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <Trash2Icon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </ListItem>
    );

    const renderPagination = () => (
      <div className="flex items-center justify-center gap-4 border-t border-gray-300 p-4 dark:border-blue-gray-800">
        <ButtonGroup variant="outlined" size="sm" className="bg-transparent">
          <IconButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="border-gray-300 text-blue-gray-900 hover:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 dark:border-blue-gray-800 dark:text-gray-200 dark:hover:bg-blue-gray-800 dark:disabled:text-gray-600"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </IconButton>
          <div className="flex min-w-[4rem] items-center justify-center border-x border-gray-300 dark:border-blue-gray-800">
            <Typography className="font-normal text-blue-gray-900 dark:text-gray-200">
              {currentPage} / {state.totalPages}
            </Typography>
          </div>
          <IconButton
            disabled={currentPage === state.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(state.totalPages, p + 1))}
            className="border-gray-300 text-blue-gray-900 hover:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 dark:border-blue-gray-800 dark:text-gray-200 dark:hover:bg-blue-gray-800 dark:disabled:text-gray-600"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </IconButton>
        </ButtonGroup>
      </div>
    );

    return (
      <>
        <Card className="h-[calc(100%-60px)] w-full justify-between bg-gray-100 dark:bg-blue-gray-800/50">
          {state.status === 'loading' && (
            <div
              className="flex h-96 items-center justify-center"
              role="status"
              aria-label="Loading"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 dark:border-blue-400" />
            </div>
          )}
          {state.status === 'error' && (
            <Alert
              color="red"
              className="m-4 w-[calc(100%-40px)] bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
              action={
                <IconButton
                  size="sm"
                  className="ml-2 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
                  onClick={() => fetchEmails()}
                >
                  <RefreshCwIcon className="h-4 w-4" />
                </IconButton>
              }
            >
              {state.error || 'Failed to load emails'}
            </Alert>
          )}

          {state.status === 'success' && (
            <>
              {state.data.length === 0 ? (
                <div className="flex h-48 items-center justify-center">
                  <Typography color="gray" className="text-center dark:text-gray-400">
                    No emails found
                  </Typography>
                </div>
              ) : (
                <>
                  <List className="overflow-y-scroll p-0">{state.data.map(renderEmailItem)}</List>
                  {renderPagination()}
                </>
              )}
            </>
          )}
        </Card>

        {contextMenu.emailId && (
          <div
            className="fixed z-50 overflow-hidden rounded-lg shadow-lg"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
          >
            <div className="bg-gray-100 py-1 dark:bg-blue-gray-900">
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-500 transition-colors duration-200 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => handleDeleteEmail(contextMenu.emailId!)}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default EmailList;
