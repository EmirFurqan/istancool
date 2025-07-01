"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronFirst, ChevronLast } from "lucide-react";

const SidebarContext = React.createContext();

export function DropdownItem({ icon, text, to }) {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === to;
    const { expanded } = useContext(SidebarContext);
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <Link
            href={to}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-300 w-full
                ${isActive 
                    ? "bg-gradient-to-tr from-gray-100 to-gray-50 text-secondary font-medium" 
                    : "text-gray-600 hover:bg-gray-100"}`}
            legacyBehavior>
            <span className="h-5 w-5 min-w-[20px] mr-3">{icon}</span>
            <span className={`overflow-hidden transition-all duration-500 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                {text}
            </span>
            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-100 text-gray-800 text-sm 
                    ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"}
                    transition-all duration-300 whitespace-nowrap z-50`}>
                    {text}
                </div>
            )}
        </Link>
    );
}

export function SidebarSection({ title, children }) {
    const { expanded } = useContext(SidebarContext);
    
    return (
        <div className="mb-4">
            <span className={`text-xs text-gray-400 uppercase px-4 mb-2 block transition-all duration-500 ${expanded ? "opacity-100 w-32" : "opacity-0 w-0"}`}>
                {title}
            </span>
            <div>{children}</div>
        </div>
    );
}

export function SidebarDropdown({ icon, text, children }) {
    const { expanded } = useContext(SidebarContext);
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="mb-2 relative group">
            <button 
                onClick={() => expanded && setIsOpen(!isOpen)}
                className={`w-full flex items-center py-3 px-3.5 rounded-full cursor-pointer transition-colors group
                    ${isOpen && expanded ? "bg-gradient-to-tr from-gray-100 to-gray-50 " : "hover:bg-gray-100 text-secondary"}`}
            >
                <div className="flex flex-1">
                    {icon}
                    <span className={`overflow-hidden transition-all font-semibold whitespace-nowrap text-sm duration-500 ${expanded ? "w-32 ml-4" : "w-0"}`}>
                        {text}
                    </span>
                </div>
                {expanded && (
                    <div className={`transition-all duration-500 ${expanded ? "w-4 opacity-100" : "w-0 opacity-0"}`}>
                        <ChevronFirst className={`h-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                )}
            </button>
            
            {expanded && (
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} ${expanded ? "w-full" : "w-0"}`}>
                    <div className="duration-500 mt-1  border-l border-gray-200 ">
                        {children}
                    </div>
                </div>
            )}

            {!expanded && (
                <div 
                    onMouseEnter={() => setIsOpen(true)}
                    className={`absolute left-full top-0 ml-2 transition-all duration-300 ease-in-out
                        ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"}`}
                >
                    <div className="bg-white rounded-lg shadow-lg py-2 w-48 border border-gray-100">
                        <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
                            {text}
                        </div>
                        <div className="px-2 space-y-1">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedExpanded = localStorage.getItem('sidebarExpanded');
        if (savedExpanded !== null) {
            setExpanded(JSON.parse(savedExpanded));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
        }
    }, [expanded, mounted]);

    useEffect(() => {
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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <aside className="min-h-screen sticky top-0 z-10">
            <nav className="h-full flex flex-col shadow-md bg-white">
                <div className="py-6 pt-6 flex justify-between items-center px-3">
                    <Link href="/" >
                        <img src="/logo.png" height={100} className={`overflow-hidden transition-all font-bruno h-auto cursor-pointer duration-500  ${expanded ? "w-20" : "w-0"}`}></img>
                    </Link>
                    <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary">
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className={`flex-1 px-2`}>{children}</ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, to }) {
    const { expanded } = useContext(SidebarContext);
    const pathname = usePathname();
    const isActive = pathname === to;

    const handleClick = (e) => {
        if (to === "/") {
            e.preventDefault();
            window.location.href = "/";
        }
    };

    return (
        <Link
            href={to}
            onClick={handleClick}
            className={`relative flex items-center py-3 px-3.5 mb-2 rounded-full cursor-pointer transition-colors group
                ${isActive ? "bg-gradient-to-tr from-gray-100 to-gray-50 text-secondary" : "hover:bg-gray-100 text-secondary"}`}
        >
            {icon}
            <span className={`overflow-hidden transition-all font-semibold whitespace-nowrap text-sm duration-500 ${expanded ? "w-44 ml-4" : "w-0"}`}>{text}</span>

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-300 text-secondary text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap`}>
                    {text}
                </div>
            )}
        </Link>
    );
} 