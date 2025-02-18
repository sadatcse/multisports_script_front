import React, { useState, useEffect, useContext, useCallback } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GoPlus } from "react-icons/go";
import Mpagination from "../../components library/Mpagination";
import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Preloader from "../../components/Shortarea/Preloader";

const TableManagement = () => {
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); // Fetch branch from AuthContext
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tableName: "",
    branch: branch, // Automatically set branch
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/table/branch/${branch}`);
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
    setLoading(false);
  }, [axiosSecure, branch]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleAddOrEditTable = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        await axiosSecure.put(`/table/update/${editId}`, formData);
      } else {
        await axiosSecure.post(`/table/post`, formData);
      }
      fetchTables();
      setIsModalOpen(false);
      setFormData({
        tableName: "",
        branch: branch, // Reset to context branch
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving table:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save table. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const table = tables.find((t) => t._id === id);
    setEditId(id);
    setFormData({ ...table, branch }); // Ensure branch remains from context
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/table/delete/${id}`)
          .then(() => {
            fetchTables();
            Swal.fire("Deleted!", "The table has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting table:", error);
            Swal.fire("Error!", "Failed to delete table.", "error");
          });
      }
    });
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: tables });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Table Management" rightcontent={
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-700 transition duration-300"
          >
            <GoPlus className="text-xl" /> Add New
          </button>
        </div>
      } />

      <div className="text-sm md:text-base">
        {rowsPerPageAndTotal}
      </div>

      {loading ? (
        <Preloader />
      ) : (
        <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
          <table className="table w-full">
            <thead className="bg-blue-600">
              <tr className="text-sm font-medium text-white text-left">
                <td className="p-3">Table Name</td>
                <td className="p-3 text-right">Action</td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">No tables found</td>
                </tr>
              ) : (
                paginatedData.map((table, index) => (
                  <tr key={index} className="hover:bg-slate-100">
                    <td className="p-3">{table.tableName}</td>
                    <td className="p-3 text-right flex justify-end gap-4">
                      <button
                        onClick={() => handleEdit(table._id)}
                        className="text-blue-500 hover:text-yellow-700 transition duration-150"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleRemove(table._id)}
                        className="text-red-500 hover:text-red-700 transition duration-150"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {paginationControls}
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit Table" : "Add New Table"}</h2>
            <input
              type="text"
              value={formData.tableName}
              onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Table Name"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    tableName: "",
                    branch: branch, // Reset to context branch
                  });
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditTable}
                className={`bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : editId !== null ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
