import { typePostCardCommentRef } from '@src/@types/typePostItem';
import { ICommentItem, type_req_create_post_comment } from '@src/@types/typeRequest';
import Api from '@src/Api';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import dayjs from 'dayjs';
import { Edit, Loader2, Send, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PostCardCommentItem from './PostCardCommentItem';

const PostCardComment = forwardRef<typePostCardCommentRef, { postId: number }>(
  ({ postId }, ref) => {
    const [firstLevelComments, setFirstLevelComments] = useState<ICommentItem[]>([]);

    const [loading, setLoading] = useState(false);
    const [isReplyComment, setIsReplyComment] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [commentTotalCount, setCommentTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const userInfo = useGlobalStore((s) => s.userInfo);

    const fetchFirstLevelComments = useCallback(
      async (page: number) => {
        setLoading(true);
        Api.xPotatoApi
          .getPost1stComment({ currentPage: page, postId, pageSize: 5 })
          .then((res) => {
            if (res.code === HTTP_RES_CODE.SUCCESS) {
              setFirstLevelComments((prev) =>
                page === 1 ? res.data.records : [...prev, ...res.data.records],
              );
              setTotalPages(res.data.pages);
              setCommentTotalCount(res.data.total);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      },
      [postId],
    );

    const createComment = async () => {
      if (!newComment.trim()) return;
      const payload: type_req_create_post_comment = {
        content: newComment,
        postId,
      };

      setLoading(true);
      Api.xPotatoApi
        .createPost1stComment(payload)
        .then((res) => {
          if (res.code === HTTP_RES_CODE.SUCCESS) {
            setNewComment('');
            setIsReplyComment(false);
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
              replyToUserId: -1,
              replyToFirstName: '',
              replyToLastName: '',
              replyToAccount: '',
              replyToAvatar: '',
              secondLevelCount: 0,
            };
            setFirstLevelComments((prev) => {
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

    const handleDeleteCommentView = (commentId: number) => {
      setFirstLevelComments((prev) => prev.filter((f) => f.commentId !== commentId));
    };

    useEffect(() => {
      fetchFirstLevelComments(1);
    }, [fetchFirstLevelComments]);

    useImperativeHandle(
      ref,
      () => ({
        goToComment: () => {
          if (isReplyComment) {
            textareaRef.current?.focus();
            textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            setIsReplyComment(true);
            setTimeout(() => {
              textareaRef.current?.focus();
              textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        },
      }),
      [isReplyComment],
    );

    return (
      <div className={`bg-blue-gray-100 p-2 dark:bg-blue-gray-900`}>
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex-1">
            {isReplyComment && (
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full resize-none rounded-lg border bg-blue-gray-200 p-2 text-blue-gray-900 dark:border-gray-700 dark:bg-blue-gray-800 dark:text-gray-100"
                style={{ maxHeight: '400px' }}
              />
            )}
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="">Total {commentTotalCount} comments</span>

              {!isReplyComment ? (
                <button
                  onClick={() => setIsReplyComment(true)}
                  className="flex items-center gap-2 rounded bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsReplyComment(false)}
                    className="flex cursor-pointer items-center gap-2 rounded bg-blue-gray-300 px-2 py-2 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => createComment()}
                    disabled={loading || !newComment.trim()}
                    className="flex items-center gap-2 rounded bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:bg-blue-gray-300"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {firstLevelComments.map((comment) => (
            <div key={comment.commentId} className="space-y-4">
              <PostCardCommentItem
                comment={comment}
                postId={postId}
                level={1}
                onDeleteCb={handleDeleteCommentView}
              />
            </div>
          ))}
        </div>

        {currentPage < totalPages ? (
          <button
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              fetchFirstLevelComments(currentPage + 1);
            }}
            className="m-auto mt-4 w-full rounded px-2 py-1 text-blue-600 outline-none hover:border-none hover:bg-gray-200 hover:outline-none focus:outline-none dark:text-blue-400 dark:hover:bg-blue-gray-700 dark:hover:text-gray-100"
          >
            {loading ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center">More +</span>
            )}
          </button>
        ) : (
          <p className="mb-4 mt-4 flex h-fit w-full items-center justify-center text-[12px] text-blue-gray-600 dark:text-gray-400">
            --- This is the bottom line ---
          </p>
        )}
      </div>
    );
  },
);

export default PostCardComment;
