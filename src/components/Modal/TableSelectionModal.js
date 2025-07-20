import React from "react";

const TableSelectionModal = ({
  isOpen,
  tables,
  selectedTable,
  handleTableSelect,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Select a Table to Start
        </h2>
        
        <div className="mb-6">
          <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-2">
            Available Tables:
          </label>
          <select
            id="table-select"
            className="border p-3 rounded w-full text-lg"
            value={selectedTable}
            onChange={handleTableSelect}
          >
            <option value="">-- Choose a table --</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                {table.tableName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onConfirm}
          disabled={!selectedTable} // Button is disabled until a table is selected
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirm and Start Order
        </button>
      </div>
    </div>
  );
};

export default TableSelectionModal;