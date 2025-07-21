import React from "react";
import { IoRestaurantOutline } from "react-icons/io5"; // Dine-in
import { BsBag } from "react-icons/bs"; // Takeaway
import { TbTruckDelivery } from "react-icons/tb"; // Delivery
import { TfiClose } from "react-icons/tfi"; // Close Icon

const OrderTypeSelectionModal = ({ isOpen, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      
      {/* Modal Content Box */}
      <div className="bg-white p-8 rounded-lg shadow-xl text-center relative w-full max-w-lg">
        
        {/* Close Button Box - Note: onClose is optional here based on UX flow */}
        {onClose && (
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
                aria-label="Close modal"
            >
                <TfiClose size={20} />
            </button>
        )}

        <h2 className="text-2xl font-bold mb-6">Select Order Type</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* Dine-in Button with Icon */}
          <button
            onClick={() => onSelect("dine-in")}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full"
          >
            <IoRestaurantOutline size={24} />
            <span>Dine-in</span>
          </button>
          
          {/* Takeaway Button with Icon */}
          <button
            onClick={() => onSelect("takeaway")}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 w-full"
          >
            <BsBag size={22} />
            <span>Takeaway</span>
          </button>
          
          {/* Delivery Button with Icon */}
          <button
            onClick={() => onSelect("delivery")}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors duration-300 w-full"
          >
            <TbTruckDelivery size={24} />
            <span>Delivery</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default OrderTypeSelectionModal;
