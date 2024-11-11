import { ChatBubbleOvalLeftEllipsisIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ICommentItem, type_req_create_post_comment } from '@src/@types/typeRequest';
import Api from '@src/Api';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import dayjs from 'dayjs';
import { Loader2, MoreVertical, Send, X } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import XPAvatar from '../XPAvatar';

const PostCardCommentItem = ({
  comment,
  postId,
  level,
  onDeleteCb,
}: {
  comment: ICommentItem;
  postId: number;
  level: number;
  onDeleteCb?: (commentId: number) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentCommentsPage, setCurrentCommentsPage] = useState<number>(1);
  const [loadCommentsEnd, setLoadCommentsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userInfo = useGlobalStore((s) => s.userInfo);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [secondLevelComments, setSecondLevelComments] = useState<ICommentItem[]>([]);

  const create2ndComment = async () => {
    if (!newComment.trim()) {
      Toast.error('Please input comments');
      return;
    }
    const payload: type_req_create_post_comment = {
      content: newComment,
      commentId: comment.commentId,
      postId,
    };

    setLoading(true);
    Api.xPotatoApi
      .createPost2ndComment(payload)
      .then((res) => {
        if (res.code === HTTP_RES_CODE.SUCCESS) {
          setNewComment('');
          setReplyingTo(null);
          Toast.success('Create comment successfully!');
          const newComment2: ICommentItem = {
            ...payload,
            commentId: res.data,
            createTime: dayjs().toString(),
            commentUserId: userInfo?.id || -1,
            commentorFirstName: userInfo?.firstName || '',
            commentorLastName: userInfo?.lastName || '',
            commentorAccount: userInfo?.userAccount || '',
            commentorAvatar: userInfo?.userAvatar || '',
            replyToUserId: comment.commentUserId,
            replyToFirstName: comment.commentorFirstName,
            replyToLastName: comment.commentorLastName,
            replyToAccount: comment.commentorAccount,
            replyToAvatar: comment.commentorAvatar,
            secondLevelCount: 0,
          };
          setSecondLevelComments((prev) => {
            const newCommentList = [...prev];
            newCommentList.unshift(newComment2);
            return newCommentList;
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleShortcut = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      create2ndComment();
    }
  };
  const handleDelete = () => {
    Api.xPotatoApi.deletePostComment({ id: comment.commentId }).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        if (res.data) {
          Toast.success('Detele Successfully!');
          onDeleteCb?.(comment.commentId);
        }
      }
    });
  };
  const fetchSecondLevelComments = async (commentId: number, page: number) => {
    Api.xPotatoApi.getPost2ndComment({ currentPage: page, pageSize: 5, commentId }).then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        setLoadCommentsEnd(secondLevelComments.length + res.data.records.length >= res.data.total);
        setSecondLevelComments((prev) => [...prev, ...res.data.records]);
      }
    });
  };
  const handleLoadMoreComments = (page: number) => {
    setCurrentCommentsPage(page);
    fetchSecondLevelComments(comment.commentId, page);
  };
  const handleDeleteView = (commentId: number) => {
    setSecondLevelComments((prev) => prev.filter((f) => f.commentId !== commentId));
  };
  const handleLoad2ndComments = () => {
    fetchSecondLevelComments(comment.commentId, 1);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`mt-4 flex h-full flex-1 flex-col gap-3`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <XPAvatar
            src={comment.commentorAvatar || ''}
            alt={comment.commentorFirstName}
            className="h-4 w-4"
          />
          <span className="max-w-[150px] truncate font-medium">
            {comment.commentorFirstName}.{comment.commentorLastName?.[0].toUpperCase() || ''}
          </span>
          <span className="dark:text-grey-100 rounded-lg border-base-100 bg-blue-gray-600 px-1 text-[10px] text-gray-300 dark:bg-blue-gray-800">
            {comment.commentUserId === userInfo?.id ? 'User' : ''}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createTime).toLocaleDateString()}
          </span>
          <div className="relative ml-auto" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && comment.commentUserId === userInfo?.id && (
              <div className="absolute right-[-4px] z-10 mt-1 rounded bg-gray-300 px-2 py-1 shadow-lg hover:bg-blue-gray-500 dark:bg-blue-gray-700 dark:hover:bg-blue-gray-500">
                <TrashIcon
                  onClick={handleDelete}
                  className="h-4 w-4 cursor-pointer text-blue-gray-900 hover:text-red-600 dark:text-gray-100 dark:hover:text-red-600"
                />
              </div>
            )}
          </div>
        </div>
        <p className="mt-1 text-gray-800 dark:text-gray-200">
          <span className="mr-2 text-[12px] text-gray-700 dark:text-gray-500">
            To <span className="">{comment.commentorFirstName}</span>:
          </span>
          {comment.content}
        </p>
        {level < 2 && (
          <div className="flex w-full items-center">
            {!replyingTo ? (
              <div
                onClick={() => setReplyingTo(comment.commentId)}
                className="mt-2 cursor-pointer rounded-lg px-2 py-1 text-sm text-blue-600 hover:bg-blue-gray-600 dark:text-blue-400 dark:hover:text-gray-100"
              >
                Reply
              </div>
            ) : (
              <div className="w-full">
                <textarea
                  value={newComment}
                  onKeyDown={(e) => {
                    handleShortcut(e);
                  }}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="mt-4 w-full resize-none rounded-lg border bg-blue-gray-200 p-2 text-blue-gray-900 dark:border-gray-700 dark:bg-blue-gray-800 dark:text-gray-100"
                />
                <div className="mt-2 flex items-center justify-end gap-2 text-sm">
                  {!loading && !!newComment.trim() && <span className="">'⇧' + '↵' Submit</span>}
                  {!loading && (
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="flex cursor-pointer items-center gap-2 rounded bg-blue-gray-300 px-2 py-2 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => create2ndComment()}
                    disabled={loading || !newComment.trim()}
                    className="flex items-center gap-2 rounded bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-gray-300 disabled:text-gray-200"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
            {!replyingTo &&
              comment.secondLevelCount > 0 &&
              secondLevelComments.length === 0 &&
              level <= 2 && (
                <div
                  title="View more comments"
                  onClick={handleLoad2ndComments}
                  className="mt-2 cursor-pointer rounded-lg px-2 py-1 text-sm text-blue-600 transition-all hover:bg-blue-gray-600 dark:text-blue-400 dark:hover:text-gray-100"
                >
                  <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                </div>
              )}
          </div>
        )}
        {secondLevelComments.length > 0 && (
          <div className={`${level <= 2 ? 'ml-4' : ''} mt-4`}>
            {secondLevelComments?.map((reply) => (
              <PostCardCommentItem
                key={reply.commentId}
                comment={reply}
                postId={postId}
                level={level + 1}
                onDeleteCb={handleDeleteView}
              />
            ))}
          </div>
        )}
        {comment.secondLevelCount > 0 &&
          secondLevelComments.length > 0 &&
          !loadCommentsEnd &&
          !replyingTo &&
          level <= 2 && (
            <div
              className="ml-4 flex cursor-pointer items-center justify-center space-y-2 rounded-lg px-2 py-1 text-[12px] text-blue-gray-900 opacity-50 dark:text-gray-100"
              onClick={() => {
                handleLoadMoreComments(currentCommentsPage + 1);
              }}
            >
              More +
            </div>
          )}
      </div>
    </div>
  );
};

export default PostCardCommentItem;
