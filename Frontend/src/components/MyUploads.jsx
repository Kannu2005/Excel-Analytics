import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUserFiles, getFileData } from './fileSlice';
import { getUserFiles, getFileData } from "../redux/fileSlice";
import { Eye, FileText, Download, Calendar, User, X, ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

const MyUploads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { files, currentFile, loading, error } = useSelector((state) => state.files);
  console.log(files)
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Add pagination state for preview data
  const [previewPage, setPreviewPage] = useState(1);
  const [previewItemsPerPage] = useState(50); // Show 50 rows per page in preview

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  const handlePreview = async (fileId) => {
    console.log('handlePreview called with fileId:', fileId);
    console.log('fileId type:', typeof fileId);
    console.log('files array:', files);
    
    if (!fileId) {
      console.error('fileId is undefined or null');
      alert('Invalid file ID. Please try again.');
      return;
    }
    
    try {
      const result = await dispatch(getFileData(fileId)).unwrap();
      console.log('File data result:', result);
      setPreviewData(result);
      setShowPreview(true);
      setPreviewPage(1); // Reset to first page when opening new preview
    } catch (error) {
      console.error('Failed to fetch file data:', error);
      alert('Failed to load file preview. Please try again.');
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    setPreviewPage(1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination logic for file grid
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPreviewData = (data) => {
    if (!data || !data.data) return <p className="text-gray-600">No data available</p>;

    // Handle different data formats
    let allRows = [];
    if (Array.isArray(data.data)) {
      allRows = data.data; // Show ALL rows instead of slicing to 10
    } else if (typeof data.data === 'object') {
      // Convert object to array of key-value pairs
      allRows = Object.entries(data.data).map(([key, value]) => ({ key, value }));
    }

    if (allRows.length === 0) {
      return <p className="text-gray-600">No preview data available</p>;
    }

    // Pagination for preview data
    const previewIndexOfLastItem = previewPage * previewItemsPerPage;
    const previewIndexOfFirstItem = previewIndexOfLastItem - previewItemsPerPage;
    const currentPreviewRows = allRows.slice(previewIndexOfFirstItem, previewIndexOfLastItem);
    const totalPreviewPages = Math.ceil(allRows.length / previewItemsPerPage);

    // If data has consistent structure (array of objects)
    if (currentPreviewRows.length > 0 && typeof currentPreviewRows[0] === 'object' && !('key' in currentPreviewRows[0])) {
      const headers = Object.keys(currentPreviewRows[0]);
      
      return (
        <div>
          {/* Data info */}
          <div className="mb-4 p-4 bg-blue-900/50 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-300 font-medium">
              Showing {previewIndexOfFirstItem + 1}-{Math.min(previewIndexOfLastItem, allRows.length)} of {allRows.length} total rows
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-slate-800 border border-slate-700 rounded-lg">
              <thead className="bg-slate-900">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-blue-300 border-b border-slate-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPreviewRows.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                    {headers.map((header, headerIndex) => (
                      <td key={headerIndex} className="px-4 py-3 text-sm text-slate-300 border-b border-slate-700">
                        {String(row[header] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Pagination */}
          {totalPreviewPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button
                onClick={() => setPreviewPage(previewPage - 1)}
                disabled={previewPage === 1}
                className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Show page numbers with ellipsis for large datasets */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                
                if (totalPreviewPages <= maxVisiblePages) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPreviewPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Show first, last, and pages around current
                  if (previewPage <= 3) {
                    pages.push(1, 2, 3, 4, '...', totalPreviewPages);
                  } else if (previewPage >= totalPreviewPages - 2) {
                    pages.push(1, '...', totalPreviewPages - 3, totalPreviewPages - 2, totalPreviewPages - 1, totalPreviewPages);
                  } else {
                    pages.push(1, '...', previewPage - 1, previewPage, previewPage + 1, '...', totalPreviewPages);
                  }
                }
                
                return pages.map((page, index) => (
                  page === '...' ? (
                    <span key={index} className="px-3 py-2 text-slate-500">...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setPreviewPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        previewPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ));
              })()}
              
              <button
                onClick={() => setPreviewPage(previewPage + 1)}
                disabled={previewPage === totalPreviewPages}
                className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      );
    }

    // For key-value pairs or simple data - also paginated
    return (
      <div>
        {/* Data info */}
        <div className="mb-4 p-4 bg-blue-900/50 border border-blue-500/50 rounded-lg">
          <p className="text-sm text-blue-300 font-medium">
            Showing {previewIndexOfFirstItem + 1}-{Math.min(previewIndexOfLastItem, allRows.length)} of {allRows.length} total items
          </p>
        </div>

        {/* Key-value pairs */}
        <div className="space-y-2 mb-4">
          {currentPreviewRows.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <span className="font-medium text-blue-300">
                {item.key || `Row ${previewIndexOfFirstItem + index + 1}`}:
              </span>
              <span className="text-slate-300">
                {String(item.value || item)}
              </span>
            </div>
          ))}
        </div>

        {/* Preview Pagination for key-value data */}
        {totalPreviewPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPreviewPage(previewPage - 1)}
              disabled={previewPage === 1}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPreviewPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPreviewPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  previewPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setPreviewPage(previewPage + 1)}
              disabled={previewPage === totalPreviewPages}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131823] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-400 font-medium">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131823] text-slate-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-slate-100 mb-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            My Uploads
          </motion.h1>
          <motion.p 
            className="text-slate-400"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            View and manage your uploaded files
          </motion.p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            Go Back
          </motion.button>

          {/* View Toggle */}
          {files.length > 0 && (
            <motion.div
              className="flex items-center bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-700"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Grid</span>
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">List</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Files Display */}
        {files.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No files uploaded yet</h3>
            <p className="text-slate-500">Upload your first file to get started</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                <AnimatePresence>
                  {currentFiles.map((file, index) => (
                    <motion.div
                      key={file._id}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 md:p-6 hover:shadow-blue-500/20 transition-shadow duration-300 hover:border-blue-500 group cursor-pointer"
                    >
                      {/* File Icon */}
                      <motion.div 
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mb-4"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <FileText className="w-6 h-6 text-white" />
                        </motion.div>
                      </motion.div>

                      {/* File Info */}
                      <div className="mb-4">
                        <motion.h3 
                          className="font-bold text-lg text-slate-200 mb-3 truncate leading-tight" 
                          title={file.originalFileName || 'Unknown File'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (index * 0.1) + 0.2 }}
                        >
                          {file.originalFileName || 'Unknown File'}
                        </motion.h3>
                        
                        <motion.div 
                          className="space-y-2 text-sm text-slate-400"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + 0.3 }}
                        >
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                            <span>{formatDate(file.uploadDate)}</span>
                          </div>
                          
                          {file.fileSize && (
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-blue-400" />
                              <span>{formatFileSize(file.fileSize)}</span>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Actions */}
                      <motion.div 
                        className="flex space-x-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index * 0.1) + 0.4 }}
                      >
                        <motion.button
                          onClick={() => handlePreview(file._id)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden sm:table-cell">Date</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">Size</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {currentFiles.map((file, index) => (
                          <motion.tr
                            key={file._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'} hover:bg-slate-700 transition-colors duration-200`}
                          >
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
                                  <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-200 truncate" title={file.originalFileName || 'Unknown File'}>
                                    {file.originalFileName || 'Unknown File'}
                                  </p>
                                  <div className="sm:hidden">
                                    <p className="text-xs text-slate-500">{formatDate(file.uploadDate || file.createdAt)}</p>
                                    {file.fileSize && <p className="text-xs text-slate-500">{formatFileSize(file.fileSize)}</p>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                              {formatDate(file.uploadDate || file.createdAt)}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-slate-400 hidden md:table-cell">
                              {file.fileSize ? formatFileSize(file.fileSize) : '-'}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <motion.button
                                onClick={() => handlePreview(file._id)}
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Preview</span>
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closePreview}
            >
              <motion.div 
                className="bg-slate-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-slate-700"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <motion.div 
                  className="flex items-center justify-between p-4 md:p-6 border-b border-slate-700"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-200">File Preview</h2>
                    {previewData && (
                      <p className="text-slate-400 mt-1 font-medium text-sm md:text-base truncate">{previewData.filename}</p>
                    )}
                  </div>
                  <motion.button
                    onClick={closePreview}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </motion.button>
                </motion.div>

                {/* Modal Content */}
                <motion.div 
                  className="flex-1 overflow-auto p-4 md:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {previewData ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {renderPreviewData(previewData)}
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-blue-400 font-medium">Loading preview...</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyUploads;