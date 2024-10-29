import React, { useState, useEffect } from 'react';
import xPotatoApi from '@/Api/xPotatoApi';
import { Post, type_req_post_query } from '@src/@types/typeRequest';
import { useParams } from 'react-router-dom';

import { useGoBack } from '@src/utils/hooks/nav';
const UserPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { userId } = useParams<{ userId: string }>();

  const goBack = useGoBack();

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserPosts = async (page = 0) => {
    try {
      setLoading(true);
      const queryParams: type_req_post_query = {
        currentPage: page, // 从0开始的页码
        pageSize: 10, // 每页显示数量
        // 可选的查询参数
        postTitle: '', // 如果需要按标题筛选
        postContent: '', // 如果需要按内容筛选
        postGenre: '', // 如果需要按类型筛选
      };
      const response = await xPotatoApi.getUserPosts(Number(userId), queryParams);

      if (response.data.code === 200) {
        const { content, totalPages, number } = response.data.data;
        setPosts(content);
        setTotalPages(totalPages);
        setCurrentPage(number);
      } else {
        console.error('Failed to fetch posts:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchUserPosts(page);
  };

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
          className="absolute left-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white p-1 hover:bg-gray-200"
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

      <section className="bg-blueGray-200 relative py-16">
        <div className="container mx-auto px-4">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
            <div className="px-6 py-8">
              <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">User Posts</h1>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {posts.length > 0 ? (
                    <>
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Content
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Genre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Comments
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Likes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap px-6 py-4">{post.postTitle}</td>
                              <td className="px-6 py-4">
                                <div className="line-clamp-2">{post.postContent}</div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">{post.postGenre}</td>
                              <td className="whitespace-nowrap px-6 py-4">{post.createTime}</td>
                              <td className="whitespace-nowrap px-6 py-4">{post.commentCount}</td>
                              <td className="whitespace-nowrap px-6 py-4">{post.likeCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-6 flex justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                          <button
                            key={page}
                            className={`mx-1 rounded-md px-4 py-2 text-sm font-medium ${
                              page === currentPage
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}
                          </button>
                        ))}
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
    </main>
  );
};

export default UserPostsPage;
