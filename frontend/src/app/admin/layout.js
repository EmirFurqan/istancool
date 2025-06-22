'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth';
import Sidebar, {SidebarItem} from '@/components/Admin/Sidebar';
import { LayoutDashboard,LayoutGrid,PlusCircle,Newspaper } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const userData = await authService.getCurrentUser();
        
        if (!userData || userData.role !== 'admin') {
          router.push('/');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('Admin erişim hatası:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="flex h-screen bg-gray-50">
      
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/admin" />
        <SidebarItem icon={<Newspaper size={20} />} text="Yazılar" to="/admin/posts" />
        <SidebarItem icon={<PlusCircle size={20} />} text="Yeni Yazı Ekle" to="/addpost" />
        <SidebarItem icon={<LayoutGrid size={20} />} text="Kategoriler" to="/admin/categories" />
      </Sidebar>
     
      <div className="flex flex-col overflow-scroll justify-between w-full h-screen bg-gray-50 z-0">
          <div className="">

            <div className="px-8 pb-4">
              {children}
            </div>
          </div>
      </div>
    </div>
  )
}
