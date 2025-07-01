'use client';

import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FileText, Folder, Users } from 'lucide-react';
import { postService } from '../../services/postService';
import { categoryService } from '../../services/category';
import { userService } from '../../services/userService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, categories: 0, users: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [categoryPostCounts, setCategoryPostCounts] = useState({ labels: [], data: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsCount, categoriesCount, usersCount, posts, users, allPosts] = await Promise.all([
          postService.getPostsCount(),
          categoryService.getCategoriesCount(),
          userService.getUsersCount(),
          postService.getAllPostsForAdmin({ limit: 5 }),
          userService.getUsers({ limit: 5 }),
          postService.getAllPostsForAdmin({ limit: 1000 }) // For chart
        ]);

        setStats({
          posts: postsCount.count,
          categories: categoriesCount.count,
          users: usersCount.count,
        });

        setRecentPosts(posts);
        setRecentUsers(users);
        
        // Calculate post counts per category for chart
        const categoryCounts = allPosts.reduce((acc, post) => {
          const categoryName = post.category?.name || 'Kategorisiz';
          acc[categoryName] = (acc[categoryName] || 0) + 1;
          return acc;
        }, {});

        setCategoryPostCounts({
          labels: Object.keys(categoryCounts),
          data: Object.values(categoryCounts),
        });

      } catch (error) {
        console.error('Dashboard verileri alınırken hata oluştu:', error);
      }
    }
    fetchData();
  }, []);

  const doughnutData = {
    labels: categoryPostCounts.labels,
    datasets: [
      {
        label: 'Kategoriye Göre Yazı Sayısı',
        data: categoryPostCounts.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Yazı</p>
            <p className="text-3xl font-bold text-gray-800">{stats.posts}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Kategori</p>
            <p className="text-3xl font-bold text-gray-800">{stats.categories}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
             <Folder className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
            <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Recent Posts */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Son Yazılar</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Kategori Dağılımı</h2>
          {categoryPostCounts.data.length > 0 ? (
            <Doughnut data={doughnutData} />
          ) : (
            <p className="text-gray-500">Yazı bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Son Kaydolan Kullanıcılar</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${user.first_name} ${user.last_name}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}