import React, { useState,  useContext } from "react";
import { FiEdit, FiSend, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GoPlus } from "react-icons/go";

import Mtitle from "../../components library/Mtitle";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Preloader from "../../components/Shortarea/Preloader";
import Dpagination from "../../components library/Dpagination";

const CustomerManagement = () => {
  const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext); // Fetch branch from AuthContext
  const [customers, setCustomers] = useState([]);
  const url = 'customer';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false); // State for SMS modal
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    anniversary: "",
    dateOfFirstVisit: new Date().toISOString().split("T")[0], 
    branch: branch, 
  });
  const [smsMessage, setSmsMessage] = useState(""); // State to hold the SMS message
  const [smsMobile, setSmsMobile] = useState(""); // State to hold the mobile number for SMS
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { paginatedData, paginationControls, rowsPerPageAndTotal, fetchData  }= Dpagination({ branch, url });


  const handleAddOrEditCustomer = async () => {
    setIsLoading(true);
    
    try {
      if (editId) {
        await axiosSecure.put(`/customer/update/${editId}`, formData);
      } else {
        await axiosSecure.post(`/customer/post`, formData);
      }
    
      setIsModalOpen(false);
      fetchData();
      setFormData({
        name: "",
        address: "",
        mobile: "",
        email: "",
        dateOfBirth: "",
        anniversary: "",
        dateOfFirstVisit: new Date().toISOString().split("T")[0], // Default to today
        branch: branch, // Reset to context branch
      });
      setEditId(null);
    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save customer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find((c) => c._id === id);
    setEditId(id);
    setFormData({ ...customer, branch }); // Ensure branch remains from context
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
        axiosSecure.delete(`/customer/delete/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "The customer has been deleted.", "success");
            fetchData();
          })
          .catch((error) => {
            console.error("Error deleting customer:", error);
            Swal.fire("Error!", "Failed to delete customer.", "error");
          });
      }
    });
  };

  const handleSendSms = async () => {
    if (!smsMessage.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty message!",
        text: "Please enter a message to send.",
      });
      return;
    }

    try {
      await axiosSecure.post("/sms/send", {
        phone: smsMobile,
        message: smsMessage,
      });
      Swal.fire("Success!", "SMS has been sent.", "success");
      setSmsMessage(""); // Clear message after sending
      setIsSmsModalOpen(false); // Close the SMS modal
    } catch (error) {
      console.error("Error sending SMS:", error);
      Swal.fire("Error!", "Failed to send SMS. Please try again.", "error");
    }
  };



  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Customer Management" rightcontent={
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
                <td className="p-3">Name</td>
                <td className="p-3">Mobile</td>
                <td className="p-3">Email</td>
                <td className="p-3 text-right">Action</td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No customers found</td>
                </tr>
              ) : (
                paginatedData.map((customer, index) => (
                  <tr key={index} className="hover:bg-slate-100">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.mobile}</td>
                    <td className="p-3">{customer.email}</td>
                    <td className="p-3 text-right flex justify-end gap-4">
                      <button
                        onClick={() => handleEdit(customer._id)}
                        className="text-blue-500 hover:text-yellow-700 transition duration-150"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleRemove(customer._id)}
                        className="text-red-500 hover:text-red-700 transition duration-150"
                      >
                        <FiTrash2 />
                      </button>
                      <button
  onClick={() => {
    setSmsMobile(customer.mobile); // Set the customer's mobile
    setIsSmsModalOpen(true); // Open the SMS modal
  }}
  className="text-green-500 hover:text-green-700 transition duration-150 flex items-center gap-2"
>
  <FiSend className="text-lg" />
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

      {/* Customer Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? "Edit Customer" : "Add New Customer"}</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Name"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Address"
            />
            <input
              type="text"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Mobile"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Email"
            />

            {/* Date of Birth and Anniversary on the same line */}
            <div className="flex gap-4 mb-4">
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-1/2 border rounded px-3 py-2"
                placeholder="Date of Birth"
              />
              <input
                type="date"
                value={formData.anniversary}
                onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                className="w-1/2 border rounded px-3 py-2"
                placeholder="Anniversary"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditCustomer}
                className={`bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : editId !== null ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Send SMS</h2>
            <input
              type="text"
              value={smsMobile}
              readOnly
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Enter message"
              rows="4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSms}
                className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition duration-300"
              >
                Send SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
