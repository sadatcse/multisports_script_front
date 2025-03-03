import React, { useState, useEffect, useCallback, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GoPlus } from "react-icons/go";
import Mtitle from "../../components library/Mtitle";
import ImageUpload from "../../config/ImageUploadcpanel";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

const CompanySettings = () => {
  const axiosSecure = UseAxiosSecure();
      const { branch } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    logo: "",
    otherInformation: "",
    branch: "",
    website: "",  // New field added
  binNumber: "", // Add bin number
  tinNumber: "", // Add tin number
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await axiosSecure.get(`/company/branch/${branch}/`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, [axiosSecure, branch]);
  
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAddOrEditCompany = async () => {
    setIsLoading(true);
    try {
      if (editId) {
        await axiosSecure.put(`/company/update/${editId}`, formData);
      } else {
        await axiosSecure.post(`/company/post`, formData);
      }
      fetchCompanies();
      setIsModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        logo: "",
        otherInformation: "",
        branch: "",
        website: "", // Reset website field
        binNumber: "", // Reset bin number field
        tinNumber: "", // Reset tin number field
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving company:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save company. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const company = companies.find((c) => c._id === id);
    setEditId(id);
    setFormData(company);
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
        axiosSecure.delete(`/company/delete/${id}`)
          .then(() => {
            fetchCompanies();
            Swal.fire("Deleted!", "The company has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting company:", error);
            Swal.fire("Error!", "Failed to delete company.", "error");
          });
      }
    });
  };

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Company Management" rightcontent={
        <div className="flex justify-end gap-4">
          {companies.length !== 1 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-700 transition duration-300"
            >
              <GoPlus className="text-xl" /> Add New
            </button>
          )}
        </div>
      } />

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-blue-600">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3">Name</td>
              <td className="p-3">Phone</td>
              <td className="p-3">Email</td>
              <td className="p-3">Address</td>
              <td className="p-3">Website</td> {/* New column */}
              <td className="p-3">Bin Number</td> {/* New column */}
              <td className="p-3">Tin Number</td> {/* New column */}
              <td className="p-3 text-right">Action</td>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No companies found</td>
              </tr>
            ) : companies.map((company, index) => (
              <tr key={index} className="hover:bg-slate-100">
                <td className="p-3">{company.name}</td>
                <td className="p-3">{company.phone}</td>
                <td className="p-3">{company.email}</td>
                <td className="p-3">{company.address}</td>
                <td className="p-3">{company.website || "N/A"}</td> {/* Display website */}
                <td className="p-3">{company.binNumber || "N/A"}</td> {/* Display bin number */}
                <td className="p-3">{company.tinNumber || "N/A"}</td> {/* Display tin number */}
                <td className="p-3 text-right flex justify-end gap-4">
                  <button
                    onClick={() => handleEdit(company._id)}
                    className="text-blue-500 hover:text-yellow-700 transition duration-150"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleRemove(company._id)}
                    className="text-red-500 hover:text-red-700 transition duration-150"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit Company" : "Add New Company"}</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Phone Number"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Email Address"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Address"
            />
            <ImageUpload setImageUrl={(url) => setFormData({ ...formData, logo: url })} />
            <textarea
              value={formData.otherInformation}
              onChange={(e) => setFormData({ ...formData, otherInformation: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Other Information"
            ></textarea>

            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Website URL"
            />
            <div className="flex gap-4">
  <input
    type="text"
    value={formData.binNumber}
    onChange={(e) => setFormData({ ...formData, binNumber: e.target.value })}
    className="w-1/2 border rounded px-3 py-2 mb-4"
    placeholder="Bin Number"
  />
  <input
    type="text"
    value={formData.tinNumber}
    onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
    className="w-1/2 border rounded px-3 py-2 mb-4"
    placeholder="Tin Number"
  />
</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    logo: "",
                    otherInformation: "",
                    branch: "",
                    website: "", // Reset website field
                  });
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditCompany}
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

export default CompanySettings;
