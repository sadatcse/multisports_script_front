import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GoPlus } from "react-icons/go";
import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

const VatBin = () => {
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); // Branch from context
  const [vatTypes, setVatTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    issue: "",
    expireDate: "",
    status: "active",
    branch: branch, // Automatically set branch
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVatTypes();
  }, []);

  const fetchVatTypes = async () => {
    try {
      const response = await axiosSecure.get(`/vattype/`);
      setVatTypes(response.data);
    } catch (error) {
      console.error("Error fetching VAT types:", error);
    }
  };

  const handleAddOrEditVatType = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        await axiosSecure.put(`/vattype/update/${editId}`, formData);
      } else {
        await axiosSecure.post(`/vattype/post`, formData);
      }
      fetchVatTypes();
      setIsModalOpen(false);
      setFormData({
        name: "",
        number: "",
        issue: "",
        expireDate: "",
        status: "active",
        branch: branch, // Reset to context branch
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving VAT type:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save VAT type. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const vatType = vatTypes.find((v) => v._id === id);
    setEditId(id);
    setFormData({ ...vatType, branch }); // Ensure branch remains from context
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
        axiosSecure.delete(`/vattype/delete/${id}`)
          .then(() => {
            fetchVatTypes();
            Swal.fire("Deleted!", "The VAT type has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting VAT type:", error);
            Swal.fire("Error!", "Failed to delete VAT type.", "error");
          });
      }
    });
  };

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="VAT Management" rightcontent={
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-700 transition duration-300"
          >
            <GoPlus className="text-xl" /> Add New
          </button>
        </div>
      } />

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-blue-600">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3">Name</td>
              <td className="p-3">Number</td>
              <td className="p-3">Issue Date</td>
              <td className="p-3">Expiry Date</td>
              <td className="p-3">Status</td>
              <td className="p-3 text-right">Action</td>
            </tr>
          </thead>
          <tbody>
            {vatTypes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No VAT types found</td>
              </tr>
            ) : (
              vatTypes.map((vatType, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="p-3">{vatType.name}</td>
                  <td className="p-3">{vatType.number}</td>
                  <td className="p-3">{new Date(vatType.issue).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(vatType.expireDate).toLocaleDateString()}</td>
                  <td className="p-3">{vatType.status}</td>
                  <td className="p-3 text-right flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(vatType._id)}
                      className="text-blue-500 hover:text-yellow-700 transition duration-150"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(vatType._id)}
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
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit VAT Type" : "Add New VAT Type"}</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="VAT Type Name"
            />
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="VAT Number"
            />
            <input
              type="date"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <input
              type="date"
              value={formData.expireDate}
              onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    name: "",
                    number: "",
                    issue: "",
                    expireDate: "",
                    status: "active",
                    branch: branch, // Reset to context branch
                  });
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditVatType}
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

export default VatBin;
