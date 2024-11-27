import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
  PencilIcon,
  EyeIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import xPotatoApi from '@/Api/xPotatoApi';
import { Post, type_req_get_all_post } from '@src/@types/typeRequest';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useGoBack } from '@src/utils/hooks/nav';
import Toast from '@src/utils/toastUtils';
import PostDetailModal from '@src/components/PostCards/PostCardModal';
import PostModal from '@src/components/PostCards/PostFormModal';

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const userInfo = useGlobalStore((s) => s.userInfo);
  const goBack = useGoBack();

  const TABLE_HEAD = ['Title', 'Author', 'Date', 'Comments', 'Likes', 'Actions'];

  useEffect(() => {
    if (userInfo?.userRole === 'admin') {
      fetchAllPosts();
    }
  }, [userInfo]);

  const fetchAllPosts = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams: type_req_get_all_post = {
        currentPage: page,
        pageSize: 20,
        postTitle: '',
        postContent: '',
        postGenre: '',
        sort: 'desc',
        userId: 0,
      };
      const response = await xPotatoApi.getAllPost(queryParams);
      if (response.code === 200) {
        const { records, total, current } = response.data;
        setPosts(records);
        setTotalPosts(total);
        setTotalPages(Math.ceil(total / 20));
        setCurrentPage(current);
      } else {
        Toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      Toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      const response = await xPotatoApi.postDelete({ id: postToDelete.id });
      if (response.code === 200) {
        if (!response.data) {
          // 检查返回的 boolean 值
          throw new Error('Delete failed');
        }
        const newTotalPosts = totalPosts - 1;
        const newTotalPages = Math.ceil(newTotalPosts / 20);
        let pageToLoad = currentPage;

        if (posts.length === 1 && currentPage > 1) {
          pageToLoad = currentPage - 1;
        }

        setTotalPosts(newTotalPosts);
        setTotalPages(newTotalPages);
        await fetchAllPosts(pageToLoad);
        Toast.success('Post deleted successfully');
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleEditPostCallback = (success: boolean) => {
    if (success) {
      fetchAllPosts(currentPage);
      setShowEditModal(false);
      Toast.success('Post updated successfully');
    } else {
      Toast.error('Failed to update post');
    }
  };

  const handlePageChange = (page: number) => {
    fetchAllPosts(page);
  };

  if (userInfo?.userRole !== 'admin') {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 pt-16 dark:bg-gray-900">
      <div
        className="fixed left-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-gray-100"
        onClick={goBack}
      >
        <ArrowLeftIcon className="h-5 w-5 text-blue-gray-900" />
      </div>

      <Card className="h-full w-full shadow-xl">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-blue-gray-50 dark:bg-blue-gray-800"
        >
          <div className="mb-4 flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Posts Management
              </Typography>
              <Typography color="gray" className="font-normal">
                Manage all blog posts
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <Button className="flex items-center gap-2 bg-blue-500 shadow-blue-500/20" size="sm">
                <DocumentTextIcon strokeWidth={2} className="h-4 w-4" />
                {totalPosts} Posts
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
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
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors duration-200 hover:bg-blue-gray-50/50"
                  >
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {post.postTitle}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {`${post.creatorFirstName} ${post.creatorLastName}`}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {format(new Date(post.createTime), 'yyyy-MM-dd')}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {post.commentCount}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {post.likeCount}
                      </Typography>
                    </td>
                    <td className="border-b border-blue-gray-50 p-4">
                      <div className="flex gap-2">
                        <Tooltip content="View Post">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Edit Post">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowEditModal(true);
                            }}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Post">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => setPostToDelete(post)}
                            className="hover:bg-red-50"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {posts.length > 0 && (
            <div className="flex items-center justify-center gap-4 border-t border-blue-gray-50 p-4">
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              <Typography color="gray" className="font-normal">
                Page <strong className="text-blue-gray-900">{currentPage}</strong> of{' '}
                <strong className="text-blue-gray-900">{totalPages}</strong>
              </Typography>
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Dialog open={!!postToDelete} handler={() => !isDeleting && setPostToDelete(null)}>
        <DialogHeader className="flex items-center gap-2">
          <XCircleIcon className="h-6 w-6 text-red-500" />
          Confirm Delete
        </DialogHeader>
        <DialogBody divider className="grid gap-4">
          <Typography color="gray" className="font-normal">
            Are you sure you want to delete the post{' '}
            <span className="font-bold">{postToDelete?.postTitle}</span>? This action cannot be
            undone.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="gray"
            onClick={() => setPostToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Spinner className="h-4 w-4" /> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      <PostModal
        open={showEditModal}
        mode="edit"
        post={selectedPost || undefined}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPost(null);
        }}
        postCb={handleEditPostCallback}
      />

      <PostDetailModal
        index={selectedPost?.id || 0}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPost(null);
        }}
        open={isDetailModalOpen}
        post={selectedPost || undefined}
      />
    </main>
  );
};

export default AdminPostsPage;
