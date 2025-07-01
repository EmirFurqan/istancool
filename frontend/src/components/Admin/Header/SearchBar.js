import { Search } from 'lucide-react';

export default function SearchBar() {
    return (
        <div className="flex-1 max-w-xs">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-white rounded-lg 
                             text-sm placeholder-gray-500 focus:outline-none"
                    placeholder="Ara..."
                />
            </div>
        </div>
    );
} 