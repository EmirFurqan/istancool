"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Settings } from "lucide-react";
import Cookies from "js-cookie";
import { authService } from "@/services/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileMenu() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState(null);
    const router = useRouter();
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authService.getCurrentUser();
            if (user) {
                setUserName(`${user.first_name} ${user.last_name}`);
                // setUserImage(user.profile_image_url); // Uncomment when you have image url
            }
        };

        fetchUser();

        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    return (
        <div className="relative">
            {/* Profil Butonu */}
            <button
                ref={buttonRef}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 cursor-pointer rounded-full hover:bg-black/10 text-gray-100 hover:text-white transition-all duration-300"
            >
                <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {userImage ? (
                        <img src={userImage} alt="Profile" className="h-full w-full object-cover rounded-full" />
                    ) : (
                        <span className="text-lg font-bold text-white">{userName ? userName[0] : ''}</span>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium">{userName || "Yükleniyor..."}</span>
                </div>
            </button>

            {/* Profil Dropdown (YENİ TASARIM) */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-200 z-50"
                    >
                        {/* Profil Başlığı */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {userImage ? (
                                    <img src={userImage} alt="Profile" className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-lg font-bold text-gray-700">{userName ? userName[0] : ''}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">Hesap Ayarları</p>
                            </div>
                        </div>

                        {/* Menü Seçenekleri */}
                        <Link href="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <User className="h-5 w-5 mr-3 text-gray-500" />
                            <span className="font-medium">Profil</span>
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <Settings className="h-5 w-5 mr-3 text-gray-500" />
                            <span className="font-medium">Ayarlar</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span className="font-medium">Çıkış Yap</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
