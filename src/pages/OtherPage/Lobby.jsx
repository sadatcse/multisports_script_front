import React from 'react';
// Import the icon from the react-icons library
import { FiTablet } from 'react-icons/fi';

// Sample data for the tables in the lobby, updated to match the new style
const fakeTables = [
    { id: 1, name: 'T1', status: 'Available', time: null, link: '#' },
    { id: 2, name: 'T2', status: 'Available', time: null, link: '#' },
    { id: 3, name: 'T3', status: 'Available', time: null, link: '#' },
    { id: 4, name: 'T4', status: 'Ordered', time: '19:30', link: '#' },
    { id: 5, name: 'T5', status: 'Available', time: null, link: '#' },
    { id: 6, name: 'T6', status: 'Ordered', time: '19:30', link: '#' },
    { id: 7, name: 'T7', status: 'Available', time: null, link: '#' },
    { id: 8, name: 'T8', status: 'Available', time: null, link: '#' },
    { id: 9, name: 'T9', status: 'Occupied', time: '4:46', link: '#' },
    { id: 10, name: 'T10', status: 'Occupied', time: '19:30', link: '#' },
    { id: 11, name: 'T11', status: 'Available', time: null, link: '#' },
    { id: 12, name: 'T12', status: 'Occupied', time: '12:15', link: '#' },
        { id: 13, name: 'T13', status: 'Occupied', time: '19:30', link: '#' },
    { id: 14, name: 'T14', status: 'Available', time: null, link: '#' },
    { id: 15, name: 'T15', status: 'Occupied', time: '12:15', link: '#' },
];

// Style mapping for different statuses
const statusStyles = {
    Available: {
        card: 'border-l-4 border-green-500 bg-green-50 hover:bg-green-100',
        text: 'text-gray-700',
        icon: 'text-green-600',
    },
    Ordered: {
        card: 'border-l-4 border-red-500 bg-red-50 hover:bg-red-100',
        text: 'text-gray-700',
        icon: 'text-red-600',
    },
    Occupied: {
        card: 'border-l-4 border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
        text: 'text-gray-700',
        icon: 'text-yellow-600',
    },
};

const Lobby = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center font-sans">
            <div className="w-full max-w-6xl">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                        Restaurant Table 
                    </h1>
                    <p className="text-gray-500 mt-2">Please Select Your table</p>
                </header>

                {/* Grid layout for the boxes */}
                <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                    {/* Map through the fake data to create a card for each table */}
                    {fakeTables.map((table) => {
                        const styles = statusStyles[table.status] || statusStyles.Available;
                        return (
                            <a
                                href={table.link}
                                key={table.id}
                                className={`rounded-lg shadow-md transition-all duration-300 flex flex-col justify-between p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${styles.card}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className={`text-xl font-bold ${styles.text}`}>{table.name}</h2>
                                    {/* Use the FiTablet icon from react-icons */}
                                    <FiTablet className={`w-6 h-6 ${styles.icon}`} />
                                </div>
                                <div className="mt-4">
                                    <p className={`text-sm font-medium ${styles.text}`}>{table.status}</p>
                                    {table.time && (
                                        <p className={`text-sm ${styles.text}`}>{table.time}</p>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </main>
            </div>
        </div>
    );
};

export default Lobby;
