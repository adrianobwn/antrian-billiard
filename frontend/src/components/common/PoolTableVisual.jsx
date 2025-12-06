import React from 'react';

const PoolTableVisual = ({
    table,
    size = 'medium',
    showStatus = true,
    interactive = false,
    onClick = null,
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-32 h-20',
        medium: 'w-48 h-28',
        large: 'w-64 h-36'
    };

    const statusColors = {
        available: 'from-green-400 to-green-600',
        occupied: 'from-red-400 to-red-600',
        reserved: 'from-yellow-400 to-yellow-600',
        maintenance: 'from-gray-400 to-gray-600'
    };

    const statusBadgeColors = {
        available: 'bg-green-100 text-green-800',
        occupied: 'bg-red-100 text-red-800',
        reserved: 'bg-yellow-100 text-yellow-800',
        maintenance: 'bg-gray-100 text-gray-800'
    };

    const tableColor = statusColors[table.status] || statusColors.available;
    const badgeColor = statusBadgeColors[table.status] || statusBadgeColors.available;

    const interactiveClasses = interactive ? 'cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg' : '';

    return (
        <div
            className={`relative ${className} ${interactiveClasses}`}
            onClick={interactive ? onClick : undefined}
        >
            {/* Pool Table */}
            <div className={`${sizeClasses[size]} relative bg-gradient-to-br ${tableColor} rounded-lg shadow-lg overflow-hidden`}>
                {/* Table Surface */}
                <div className="absolute inset-1 bg-gradient-to-br from-green-800 to-green-900 rounded-sm">
                    {/* Pool Table Pattern */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="grid grid-cols-2 grid-rows-2 h-full">
                            <div className="border-r border-b border-green-700"></div>
                            <div className="border-l border-b border-green-700"></div>
                            <div className="border-r border-t border-green-700"></div>
                            <div className="border-l border-t border-green-700"></div>
                        </div>
                    </div>

                    {/* Pool Balls (decorative) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full shadow-md"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-md"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-md"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-md"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full shadow-md"></div>
                    </div>
                </div>

                {/* Table Rails */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800"></div>
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800"></div>
                <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800"></div>

                {/* Corner Pockets */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-black rounded-full"></div>
            </div>

            {/* Table Number */}
            <div className="absolute -top-2 -left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-gray-200">
                <span className="text-xs font-bold text-gray-700">{table.number}</span>
            </div>

            {/* Status Badge */}
            {showStatus && (
                <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold ${badgeColor} shadow-md`}>
                    {table.status}
                </div>
            )}

            {/* Interactive Overlay */}
            {interactive && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
            )}
        </div>
    );
};

export default PoolTableVisual;