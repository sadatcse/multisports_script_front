import React, { useState, useEffect } from "react";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import Swal from "sweetalert2";

const UserAccess = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const axiosSecure = UseAxiosSecure();

  const fetchUserLogs = async (page) => {
    try {
      const response = await axiosSecure.get(`/userlog/paginated?page=${page}&limit=10`);
      const { logs, totalPages } = response.data;

      setUserLogs(logs);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching user logs:", error);
    }
  };

  useEffect(() => {
    fetchUserLogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/userlog/delete/${id}`);
          Swal.fire("Deleted!", "The user log has been deleted.", "success");
          fetchUserLogs(currentPage);
        } catch (error) {
          console.error("Error deleting user log:", error);
          Swal.fire("Error!", "Failed to delete the user log.", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="bg-white border rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">User Access Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-3 border">SL.No</th>
                <th className="p-3 border">User Email</th>
                <th className="p-3 border">Username</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Login Time</th>
                <th className="p-3 border">Logout Time</th>

                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">No logs found</td>
                </tr>
              ) : (
                userLogs.map((log, index) => (
                  <tr key={log._id} className="hover:bg-gray-100">
                    <td className="p-3 border text-center">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="p-3 border">{log.userEmail}</td>
                    <td className="p-3 border">{log.username}</td>
                    <td className="p-3 border">{log.role}</td>
                    <td className="p-3 border">
                      {log.loginTime ? new Date(log.loginTime).toLocaleString() : "N/A"}
                    </td>
                    <td className="p-3 border">
                      {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : "N/A"}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserAccess;
