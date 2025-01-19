import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GoPlus } from "react-icons/go";
import Mpagination from "../../components library/Mpagination";
import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

const Counter = () => {
  const axiosSecure = UseAxiosSecure();
  const [counters, setCounters] = useState([]);
  const { branch } = useContext(AuthContext); // Branch from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    counterName: "",
    counterSerial: "",
    branch: branch, // Automatically set branch
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await axiosSecure.get(`/counter/`);
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  const handleAddOrEditCounter = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        await axiosSecure.put(`/counter/update/${editId}`, formData);
      } else {
        await axiosSecure.post(`/counter/post`, formData);
      }
      fetchCounters();
      setIsModalOpen(false);
      setFormData({
        counterName: "",
        counterSerial: "",
        branch: branch, // Reset to context branch
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving counter:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save counter. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const counter = counters.find((c) => c._id === id);
    setEditId(id);
    setFormData({ ...counter, branch }); // Ensure branch remains from context
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
        axiosSecure.delete(`/counter/delete/${id}`)
          .then(() => {
            fetchCounters();
            Swal.fire("Deleted!", "The counter has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting counter:", error);
            Swal.fire("Error!", "Failed to delete counter.", "error");
          });
      }
    });
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: counters });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Counter Management" rightcontent={
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

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-blue-600">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3">Counter Name</td>
              <td className="p-3">Counter Serial</td>
          
              <td className="p-3 text-right">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No counters found</td>
              </tr>
            ) : (
              paginatedData.map((counter, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3">{counter.counterName}</td>
                  <td className="p-3">{counter.counterSerial}</td>
                
                  <td className="p-3 text-right flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(counter._id)}
                      className="text-blue-500 hover:text-yellow-700 transition duration-150"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(counter._id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit Counter" : "Add New Counter"}</h2>
            <input
              type="text"
              value={formData.counterName}
              onChange={(e) => setFormData({ ...formData, counterName: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Counter Name"
            />
            <input
              type="number"
              value={formData.counterSerial}
              onChange={(e) => setFormData({ ...formData, counterSerial: parseInt(e.target.value) || "" })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Counter Serial"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    counterName: "",
                    counterSerial: "",
                    branch: branch, // Reset to context branch
                  });
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditCounter}
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

export default Counter;
