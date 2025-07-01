'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth';
import Sidebar, { SidebarItem, SidebarSection } from '@/components/Admin/Sidebar';
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  Settings,
  User,
  Star,
  PlusCircle,
} from "lucide-react";
import Header from "@/components/Admin/Header/Header";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            Yükleniyor...
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
        <Sidebar>
          <SidebarSection title="Genel">
            <SidebarItem icon={<LayoutDashboard />} text="Panel" to="/admin" />
          </SidebarSection>
          <SidebarSection title="İçerik Yönetimi">
            <SidebarItem icon={<Newspaper />} text="Yazılar" to="/admin/posts" />
            <SidebarItem icon={<PlusCircle />} text="Yeni Yazı Ekle" to="/admin/addpost" />
            <SidebarItem icon={<Folders />} text="Kategoriler" to="/admin/categories" />
            <SidebarItem icon={<Star />} text="Öne Çıkanlar" to="/admin/featured" />
          </SidebarSection>
          <SidebarSection title="Yönetim">
            <SidebarItem icon={<User />} text="Kullanıcılar" to="/admin/users" />
            <SidebarItem icon={<Settings />} text="Ayarlar" to="/admin/settings" />
          </SidebarSection>
        </Sidebar>

        <div className="flex-1 overflow-y-auto">
            <Header />
            <main className="p-6">{children}</main>
        </div>
    </div>
  );
}
