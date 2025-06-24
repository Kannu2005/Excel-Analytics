import React, { useState, useEffect } from "react";
import { getAllFiles, deleteFile } from "../utils/adminApi";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from "lucide-react";

const FileListModal = ({ isOpen, onClose, onFileDeleted }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "uploaded", direction: "desc" });

  useEffect(() => {
    if (isOpen) fetchFiles();
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const fileData = await getAllFiles();
      setFiles(fileData);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?\nThis will also delete all associated charts.`)) return;
    setDeleting(fileId);
    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      onFileDeleted();
      alert("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter((file) => {
    const name = file.fileName || file.originalFileName || "";
    const user =
      file.user?.name ||
      file.user?.email ||
      file.userId?.name ||
      file.userId?.email ||
      "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || user.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const key = sortConfig.key;
    const aVal =
      key === "name"
        ? a.fileName || a.originalFileName
        : key === "size"
        ? a.fileSize || a.size
        : new Date(a.uploadDate || a.uploadedAt);
    const bVal =
      key === "name"
        ? b.fileName || b.originalFileName
        : key === "size"
        ? b.fileSize || b.size
        : new Date(b.uploadDate || b.uploadedAt);

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-[#14213D] via-[#1F2A48] to-[#192A4E] shadow-2xl border border-blue-900/30 p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-800 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-white">📁 File Management</h2>
          <button onClick={onClose} className="text-white text-2xl hover:scale-110 transition-transform">
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-blue-800 w-full max-w-md">
            <Search className="w-4 h-4 text-blue-200" />
            <input
              type="text"
              placeholder="Search by file or user..."
              className="bg-transparent outline-none text-white w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* File Table */}
        {loading ? (
          <div className="text-center text-blue-200 py-20">
            <div className="text-3xl mb-2 animate-pulse">⏳</div>
            <p>Loading files...</p>
          </div>
        ) : sortedFiles.length === 0 ? (
          <div className="text-center text-blue-200 py-20">
            <div className="text-4xl mb-2">📁</div>
            <p>No files found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-blue-800 bg-white/5 backdrop-blur-md">
            <table className="min-w-full divide-y divide-blue-900">
              <thead className="bg-blue-900/20">
                <tr>
                  {[
                    { label: "File Name", key: "name" },
                    { label: "User" },
                    { label: "Size", key: "size" },
                    { label: "Uploaded", key: "uploaded" },
                    { label: "Status" },
                    { label: "Actions" },
                  ].map(({ label, key }) => (
                    <th key={label} className="px-6 py-4 text-left text-sm font-semibold text-blue-100 uppercase">
                      <div
                        className="flex items-center gap-1 cursor-pointer select-none"
                        onClick={() => key && toggleSort(key)}
                      >
                        {label}
                        {key &&
                          (sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpWideNarrow className="w-4 h-4" />
                            ) : (
                              <ArrowDownWideNarrow className="w-4 h-4" />
                            )
                          ) : null)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900 text-sm text-blue-100">
                {sortedFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-blue-900/10 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        {file.fileName || file.originalFileName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {file.user?.name ||
                        file.user?.email ||
                        file.userId?.name ||
                        file.userId?.email ||
                        "Unknown"}
                    </td>
                    <td className="px-6 py-4">{formatFileSize(file.fileSize || file.size)}</td>
                    <td className="px-6 py-4">
                      {new Date(file.uploadDate || file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          file.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : file.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : file.status === "failed"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {file.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        title="Delete this file"
                        onClick={() =>
                          handleDeleteFile(file._id, file.fileName || file.originalFileName)
                        }
                        disabled={deleting === file._id}
                        className={`px-4 py-1 rounded-md text-sm font-medium transition duration-300 ${
                          deleting === file._id
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {deleting === file._id ? "Deleting..." : "Delete"}
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
  );
};

export default FileListModal;
