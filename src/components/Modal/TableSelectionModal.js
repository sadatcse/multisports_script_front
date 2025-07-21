import React from "react";
import { TfiClose } from "react-icons/tfi"; // Close Icon
import { LuArmchair } from "react-icons/lu"; // A nice icon for a table/seat
import { BsFillCheckCircleFill } from "react-icons/bs"; // Checkmark for selection

const TableSelectionModal = ({
  isOpen,
  tables,
  selectedTable,
  handleTableSelect,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      
      {/* Modal Panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Select a Table</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <TfiClose size={20} />
          </button>
        </div>

        {/* Table Selection Grid (Scrollable) */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable === table._id;
              return (
                <button
                  key={table._id}
                  onClick={() => handleTableSelect(table._id)} // Pass ID directly
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg aspect-square
                              cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 
                              focus:ring-offset-2 focus:ring-blue-500
                              ${isSelected
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
                              }`}
                >
                  {/* Selected Checkmark Icon */}
                  {isSelected && (
                    <BsFillCheckCircleFill className="absolute top-2 right-2 text-blue-600" size={20} />
                  )}
                  
                  <LuArmchair
                    size={40}
                    className={`mb-2 transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span className={`font-semibold text-center ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                    {table.tableName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer & Action Button */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onConfirm}
            disabled={!selectedTable}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg
                       hover:bg-blue-700 transition-colors duration-300
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm and Start Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableSelectionModal;