import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import confetti from "canvas-confetti"; // 🎉 Emoji burst confetti
import { FaFileUpload, FaFileExcel, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { uploadFile, clearError, clearUploadSuccess } from "../redux/fileSlice";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, uploadSuccess } = useSelector((state) => state.files);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
      dispatch(clearError());
    } else {
      alert("Please select a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("excel", selectedFile);

    try {
      await dispatch(uploadFile(formData)).unwrap();
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess();
      if (audioRef.current) audioRef.current.play();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const launchEmojiBurst = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.7 },
      emojis: ["🎉", "✨", "📊", "📁", "✅"],
      scalar: 1.3,
    });
  };

  useEffect(() => {
    if (uploadSuccess) {
      launchEmojiBurst(); // 🎇 Trigger emoji burst
      setTimeout(() => {
        dispatch(clearUploadSuccess());
      }, 3000);
    }
  }, [uploadSuccess, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      <audio ref={audioRef} src="/success.mp3" preload="auto" />
      {uploadSuccess && <Confetti numberOfPieces={200} recycle={false} />}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-sky-500 backdrop-blur-md bg-white/10"
      >
        <motion.div
          animate={{
            borderColor: dragOver ? "#38bdf8" : "#0ea5e9",
            backgroundColor: dragOver ? "#1e40af44" : "transparent",
            scale: dragOver ? 1.02 : 1,
          }}
          transition={{ duration: 0.4 }}
          className={`border-2 border-dashed rounded-xl p-6 text-center backdrop-blur-md transition-all ${
            dragOver ? "border-sky-400 bg-sky-700/10" : "border-sky-600"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <motion.div
              className="text-5xl text-sky-400 drop-shadow-glow"
              animate={{
                scale: dragOver ? 1.2 : 1,
                rotate: dragOver ? [0, -3, 3, 0] : 0,
              }}
            >
              <FaFileExcel />
            </motion.div>
            <p className="text-lg font-medium text-sky-200">Drop Excel file or click</p>
            <p className="text-sm text-sky-400">.xlsx or .xls up to 10MB</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg text-white bg-sky-700 hover:bg-sky-500 cursor-pointer text-sm"
            >
              <FaFileUpload className="drop-shadow-glow" />
              Choose File
            </motion.label>
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-slate-800 rounded-lg text-sky-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div>
                  <p className="font-medium break-words">{selectedFile.name}</p>
                  <p className="text-sm text-sky-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedFile(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <FaTrashAlt />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={loading}
                className="mt-3 w-full py-2 px-4 bg-sky-700 text-white rounded-lg hover:bg-sky-500 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload File"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-sky-900/50 border border-sky-500 text-sky-300 rounded-lg text-sm"
            >
              File uploaded successfully! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="py-2 px-4 bg-sky-700 text-white rounded-lg hover:bg-sky-500 text-sm flex items-center gap-2"
          >
            <FaArrowLeft /> Go Back
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FileUpload;
