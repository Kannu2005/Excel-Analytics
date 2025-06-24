import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllUsers, deleteUser } from "../utils/adminApi";

const UserListModal = ({ isOpen, onClose, onUserDeleted }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This will also delete all their files and charts.`
      )
    ) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      onUserDeleted();
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="rounded-lg shadow-xl w-full max-w-5xl max-h-[80vh] overflow-hidden bg-[#192A4E] backdrop-blur border border-blue-500/30">
        <div className="p-6 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-white hover:opacity-70"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scroll">
          {loading ? (
            <div className="text-center py-8 text-blue-200">
              <div className="text-2xl animate-pulse">⏳</div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-blue-200">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-600 hover:bg-blue-800/10 transition"
                    >
                      <td className="py-3 px-4 flex items-start gap-3 relative">
                        {/* Gradient Accent Bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400"></div>

                        {/* Avatar & Name */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{user.name}</span>

                              {/* Optional Live Dot */}
                              {user.isOnline && (
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block animate-pulse" title="Online"></span>
                              )}
                            </div>

                            {/* Registration Date */}
                            {user.createdAt && (
                              <p className="text-xs text-gray-400">
                                Registered on:{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-300">{user.email}</td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deleting === user._id}
                          className={`relative px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                            deleting === user._id
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 hover:shadow-md"
                          } text-white group`}
                        >
                          {deleting === user._id ? "Deleting..." : "Delete"}
                          <span className="absolute hidden group-hover:block text-xs -top-8 right-0 bg-gray-800 text-white px-2 py-1 rounded shadow-md z-10">
                            Deletes user & data
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserListModal;
