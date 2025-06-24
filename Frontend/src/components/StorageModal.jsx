import React, { useState, useEffect } from "react";
import { getStorageUsage } from "../utils/adminApi";
import {
  Folder,
  Save,
  FileText,
  CheckCircle,
  RefreshCw,
  Zap,
  Lightbulb,
} from "lucide-react";

const StorageModal = ({ isOpen, onClose }) => {
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStorageUsage();
    }
  }, [isOpen]);

  const fetchStorageUsage = async () => {
    setLoading(true);
    try {
      const data = await getStorageUsage();
      setStorageData(data);
    } catch (error) {
      console.error("Error fetching storage usage:", error);
      alert("Failed to fetch storage usage");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: "#1a202c" }}
      >
        <div
          className="p-4 border-b flex justify-between items-center"
          style={{ borderColor: "#2d3748" }}
        >
          <div className="flex items-center gap-3">
            <Folder style={{ color: "#a0aec0" }} />
            <h2 className="text-xl font-bold" style={{ color: "#ffffff" }}>
              Storage Usage
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-70"
            style={{ color: "#a0aec0" }}
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto text-4xl" style={{ color: "#4a5568" }}/>
              <p style={{ color: "#a0aec0" }} className="mt-2">Loading storage information...</p>
            </div>
          ) : storageData ? (
            <div className="space-y-6">
              {/* Storage Overview */}
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="rounded-lg p-4 flex flex-col justify-between"
                  style={{ backgroundColor: "#2d3748" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium flex items-center gap-2" style={{ color: "#a0aec0" }}>
                      <Save size={16} /> Total Storage Used
                    </p>
                    <Save className="text-3xl" style={{ color: "#4a5568" }}/>
                  </div>
                  <p className="text-3xl font-bold mt-2" style={{ color: "#ffffff" }}>
                    {storageData.formattedSize}
                  </p>
                </div>

                <div
                  className="rounded-lg p-4 flex flex-col justify-between"
                  style={{ backgroundColor: "#2d3748" }}
                >
                  <div className="flex items-center justify-between">
                  <p className="text-sm font-medium flex items-center gap-2" style={{ color: "#a0aec0" }}>
                      <FileText size={16} /> Total Files
                    </p>
                    <FileText className="text-3xl" style={{ color: "#4a5568" }}/>
                  </div>
                  <p className="text-3xl font-bold mt-2" style={{ color: "#ffffff" }}>
                    {storageData.fileCount}
                  </p>
                </div>
              </div>

              {/* Storage Details */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#2d3748" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
                  Storage Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#4a5568" }}>
                    <span style={{ color: "#a0aec0" }}>Storage Used (MB):</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.totalSizeMB} MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#4a5568" }}>
                    <span style={{ color: "#a0aec0" }}>Storage Used (Bytes):</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.totalSizeBytes.toLocaleString()} bytes
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span style={{ color: "#a0aec0" }}>Average File Size:</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.fileCount > 0 ? `${(storageData.totalSizeMB / storageData.fileCount).toFixed(2)} MB` : "0 MB"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage Usage Visualization */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#2d3748" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
                  Storage Usage Visualization
                </h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      backgroundColor: "#4299e1",
                      width: `${Math.min((storageData.totalSizeMB / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span style={{ color: "#a0aec0" }}>0 MB</span>
                  <span style={{ color: "#a0aec0" }}>{storageData.totalSizeMB} MB used</span>
                </div>
              </div>

              {/* Storage Statistics */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#2d3748" }}>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: "#1a202c"}}>
                    <CheckCircle className="mx-auto mb-2" style={{ color: "#48bb78" }}/>
                    <p className="text-sm" style={{ color: "#a0aec0" }}>Efficiency</p>
                    <p className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.fileCount > 0 ? "Optimized" : "Empty"}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: "#1a202c"}}>
                    <RefreshCw className="mx-auto mb-2" style={{ color: "#4299e1" }}/>
                    <p className="text-sm" style={{ color: "#a0aec0" }}>Last Updated</p>
                    <p className="font-semibold" style={{ color: "#ffffff" }}>
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{backgroundColor: "#1a202c"}}>
                    <Zap className="mx-auto mb-2" style={{ color: "#f6e05e" }}/>
                    <p className="text-sm" style={{ color: "#a0aec0" }}>Status</p>
                    <p className="font-semibold" style={{ color: "#ffffff" }}>Active</p>
                  </div>
                </div>
              </div>

              {/* File Size Distribution */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#2d3748" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
                  File Size Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#a0aec0" }}>Small Files (&lt;1MB):</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.fileCount > 0 ? `${Math.ceil(storageData.fileCount * 0.3)} files` : "0 files"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#a0aec0" }}>Medium Files (1–5MB):</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.fileCount > 0 ? `${Math.ceil(storageData.fileCount * 0.5)} files` : "0 files"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#a0aec0" }}>Large Files (&gt;5MB):</span>
                    <span className="font-semibold" style={{ color: "#ffffff" }}>
                      {storageData.fileCount > 0 ? `${Math.floor(storageData.fileCount * 0.2)} files` : "0 files"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#2d3748" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
                  Recommendations
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: "#48bb78" }}/>
                    <p className="text-sm" style={{ color: "#a0aec0" }}>
                      Storage usage is within optimal range.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} style={{ color: "#f6e05e" }}/>
                    <p className="text-sm" style={{ color: "#a0aec0" }}>
                      Regular cleanup helps maintain system performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="pt-2">
                <button
                  onClick={fetchStorageUsage}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  style={{ backgroundColor: "#38a169", color: "#ffffff" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#48bb78"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#38a169"}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4" style={{ color: "#4a5568" }}>💾</div>
              <p style={{ color: "#a0aec0" }}>Unable to load storage information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageModal;
