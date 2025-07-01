import { Bell } from 'lucide-react';
import { useState } from 'react';

export default function Notifications() {
    const [notifications, setNotifications] = useState(3);

    return (
        <button className="relative p-2 text-gray-100 hover:text-white rounded-full hover:bg-secondary/55 shadow-2xl">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs 
                               font-bold leading-none text-secondary transform translate-x-1/2 -translate-y-1/2 
                               bg-white rounded-full">
                    {notifications}
                </span>
            )}
        </button>
    );
} 