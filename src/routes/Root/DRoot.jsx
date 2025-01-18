import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DRoot = () => {
    return (
        <div className="flex">
            <div className='fixed w-[200px] h-full'>
                <Sidebar />
            </div>
            <div className='ml-[200px] flex-1 p-9'>
                <Outlet />
            </div>
        </div>
    );
};

export default DRoot;