import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import xPotatoApi from '@/Api/xPotatoApi';
import { Post, type_req_get_all_post } from '@src/@types/typeRequest';
import ConfirmModal from '@src/components/ConfirmModal';
import PostDetailModal from '@src/components/PostCards/PostCardModal';
import PostModal from '@src/components/PostCards/PostFormModal';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useGoBack } from '@src/utils/hooks/nav';
import Toast from '@src/utils/toastUtils';

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const userInfo = useGlobalStore((s) => s.userInfo);
  const goBack = useGoBack();

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
        pageSize: 10,
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
        setTotalPages(Math.ceil(total / 10));
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
    if (!selectedPost) return;
    try {
      const response = await xPotatoApi.postDelete({ id: selectedPost.id });
      if (response.code === 200) {
        const newTotalPosts = totalPosts - 1;
        const newTotalPages = Math.ceil(newTotalPosts / 10);
        const isCurrentPageEmpty = posts.length === 1;
        const isLastPage = currentPage === totalPages;

        setTotalPosts(newTotalPosts);
        setTotalPages(newTotalPages);

        let pageToLoad = currentPage;
        if (isCurrentPageEmpty && currentPage > 1) {
          pageToLoad = currentPage - 1;
        } else if (isLastPage && !isCurrentPageEmpty) {
          pageToLoad = currentPage;
        }

        await fetchAllPosts(pageToLoad);
        setShowDeleteModal(false);
        Toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Toast.error('Failed to delete post');
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

  const openDetailModal = (post: Post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = (post: Post) => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
    if (post) {
      setPosts((prevPosts) => prevPosts.map((p) => (p.id === post.id ? { ...p, ...post } : p)));
    }
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
  };

  const openDeleteModal = (post: Post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page: number) => {
    fetchAllPosts(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pageNumbers.push(-1);
      }
    }
    return [...new Set(pageNumbers)];
  };

  if (userInfo?.userRole !== 'admin') {
    return null;
  }

  return (
    <main className="page-content">
      <section className="relative block h-[300px]">
        <div
          className="absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
          }}
        >
          <span className="absolute h-full w-full bg-black opacity-50"></span>
        </div>
        <div
          className="absolute left-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white p-1 text-blue-gray-900 hover:bg-gray-200"
          onClick={() => goBack()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </div>
      </section>

      <section className="relative bg-blue-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl dark:bg-blue-gray-900">
            <div className="px-6 py-8">
              <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-blue-gray-100">
                All Posts Management
              </h1>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-blue-gray-200"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {posts.length > 0 ? (
                    <>
                      <table className="w-full table-auto dark:bg-blue-gray-900">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-blue-gray-700">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Comments
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Likes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-blue-gray-900 dark:bg-blue-gray-800 dark:text-gray-400">
                          {posts.map((post) => (
                            <tr
                              key={post.id}
                              className="hover:bg-gray-50 dark:hover:bg-blue-gray-700"
                            >
                              <td className="whitespace-nowrap px-6 py-4">{post.postTitle}</td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {post.creatorFirstName} {post.creatorLastName}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {format(new Date(post.createTime), 'yyyy-MM-dd')}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">{post.commentCount}</td>
                              <td className="whitespace-nowrap px-6 py-4">{post.likeCount}</td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openDetailModal(post)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => openEditModal(post)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(post)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:bg-blue-gray-900 dark:text-blue-gray-200 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-blue-gray-200">
                              Showing{' '}
                              <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                              <span className="font-medium">
                                {Math.min(currentPage * 10, totalPosts)}
                              </span>{' '}
                              of <span className="font-medium">{totalPosts}</span> results
                            </p>
                          </div>
                          <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                              <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                              >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" />
                              </button>

                              {getPageNumbers().map((pageNumber, index) =>
                                pageNumber === -1 ? (
                                  <span
                                    key={`ellipsis-${index}`}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-blue-gray-200"
                                  >
                                    ...
                                  </span>
                                ) : (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                      pageNumber === currentPage
                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-blue-gray-200'
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                ),
                              )}

                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                              >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" />
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-gray-500">No posts found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <PostModal
        open={showEditModal}
        mode="edit"
        post={selectedPost || undefined}
        onClose={closeEditModal}
        postCb={handleEditPostCallback}
      />

      <PostDetailModal
        index={selectedPost?.id || 0}
        onClose={handleDetailModalClose}
        open={isDetailModalOpen}
        post={selectedPost || undefined}
      />
    </main>
  );
};

export default AdminPostsPage;
