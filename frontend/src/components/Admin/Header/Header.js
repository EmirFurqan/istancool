"use client";

import React from 'react';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';

function Header() {
    return (
        <div className="relative">
            <header className="w-full  from-primary to-secondary bg-gradient-to-r z-50">
                <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Sağ Menü */}
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-4">
                            <Notifications />
                            <ProfileMenu />
                        </div>
                    </div>
                </div>
            </header>    
        </div>
    );
}

export default Header;