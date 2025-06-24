const User = require("../models/User");
const FileUpload = require("../models/FileUpload");
const Chart = require("../models/Chart");
const fs = require("fs");
const path = require("path");

// Get comprehensive chart statistics
const getChartStats = async (req, res) => {
  try {
    // Total charts count
    const totalCharts = await Chart.countDocuments();

    // Recent charts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCharts = await Chart.countDocuments({
      createdDate: { $gte: thirtyDaysAgo },
    });

    // Charts grouped by type
    const chartsByType = await Chart.aggregate([
      {
        $group: {
          _id: "$chartType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Top users by chart count
    const topUsers = await Chart.aggregate([
      {
        $group: {
          _id: "$userId",
          chartCount: { $sum: 1 },
        },
      },
      {
        $sort: { chartCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          chartCount: 1,
          userName: "$userInfo.name",
          userEmail: "$userInfo.email",
        },
      },
    ]);

    // Charts created over time (last 7 days)
    const chartTrends = await Chart.aggregate([
      {
        $match: {
          createdDate: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdDate",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const stats = {
      totalCharts,
      recentCharts,
      chartsByType,
      topUsers,
      chartTrends,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching chart stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chart statistics",
      error: error.message,
    });
  }
};

// Get all charts with pagination and filtering
const getAllCharts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      chartType,
      userId,
      sortBy = "createdDate",
      sortOrder = "desc",
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (chartType && chartType !== "all") {
      filter.chartType = chartType;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (search) {
      filter.$or = [
        { chartName: { $regex: search, $options: "i" } },
        { xAxis: { $regex: search, $options: "i" } },
        { yAxis: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get charts with user and file information
    const charts = await Chart.find(filter)
      .populate("userId", "name email")
      .populate("fileId", "originalName uploadDate fileType fileSize")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCharts = await Chart.countDocuments(filter);
    const totalPages = Math.ceil(totalCharts / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        charts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCharts,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching charts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch charts",
      error: error.message,
    });
  }
};

// Get chart by ID with full details
const getChartById = async (req, res) => {
  try {
    const { chartId } = req.params;

    const chart = await Chart.findById(chartId)
      .populate("userId", "name email createdAt")
      .populate("fileId", "originalName uploadDate fileType fileSize filePath")
      .lean();

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chart,
    });
  } catch (error) {
    console.error("Error fetching chart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chart details",
      error: error.message,
    });
  }
};

// Delete chart by ID
const deleteChart = async (req, res) => {
  try {
    const { chartId } = req.params;

    // Check if chart exists
    const chart = await Chart.findById(chartId);
    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      });
    }

    // Delete the chart
    await Chart.findByIdAndDelete(chartId);

    res.status(200).json({
      success: true,
      message: "Chart deleted successfully",
      data: { deletedChartId: chartId },
    });
  } catch (error) {
    console.error("Error deleting chart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chart",
      error: error.message,
    });
  }
};

// Bulk delete charts
const bulkDeleteCharts = async (req, res) => {
  try {
    const { chartIds } = req.body;

    if (!chartIds || !Array.isArray(chartIds) || chartIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid chart IDs array",
      });
    }

    // Delete multiple charts
    const result = await Chart.deleteMany({
      _id: { $in: chartIds },
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} charts`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Error bulk deleting charts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete charts",
      error: error.message,
    });
  }
};

// Get dashboard overview
const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCharts,
      totalUsers,
      chartsToday,
      chartsThisWeek,
      chartsThisMonth,
      recentActivity,
    ] = await Promise.all([
      Chart.countDocuments(),
      User.countDocuments(),
      Chart.countDocuments({ createdDate: { $gte: startOfDay } }),
      Chart.countDocuments({ createdDate: { $gte: startOfWeek } }),
      Chart.countDocuments({ createdDate: { $gte: startOfMonth } }),
      Chart.find()
        .populate("userId", "name email")
        .populate("fileId", "originalName")
        .sort({ createdDate: -1 })
        .limit(10)
        .lean(),
    ]);

    const overview = {
      totalCharts,
      totalUsers,
      chartsToday,
      chartsThisWeek,
      chartsThisMonth,
      recentActivity,
    };

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalFiles = await FileUpload.countDocuments();
    const totalCharts = await Chart.countDocuments();

    // Count active sessions (users who logged in within last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activeSessions = await User.countDocuments({
      lastLogin: { $gte: yesterday },
    });

    res.json({
      totalUsers,
      totalFiles,
      totalCharts,
      activeSessions,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's charts
    const deletedCharts = await Chart.deleteMany({ userId });
    console.log(
      `Deleted ${deletedCharts.deletedCount} charts for user ${userId}`
    );

    // Delete user's file records (no physical files to delete since data is stored in DB)
    const deletedFiles = await FileUpload.deleteMany({ userId });
    console.log(
      `Deleted ${deletedFiles.deletedCount} file records for user ${userId}`
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
      deletedCharts: deletedCharts.deletedCount,
      deletedFiles: deletedFiles.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all files
const getAllFiles = async (req, res) => {
  try {
    const files = await FileUpload.find()
      .populate("userId", "name email")
      .sort({ uploadDate: -1 }); // Changed from uploadedAt to uploadDate

    // Format the response to include the specific fields you want
    const formattedFiles = files.map((file) => ({
      _id: file._id,
      fileName: file.originalFileName,
      fileSize: file.fileSize,
      uploadDate: file.uploadDate,
      status: file.status,
      columns: file.columns,
      user: file.userId, // This will contain populated user data (name, email)
      dataRowCount: file.data ? file.data.length : 0, // Optional: show how many rows of data
    }));

    res.json(formattedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Validate fileId
    if (!fileId) {
      return res.status(400).json({ message: "File ID is required" });
    }

    const file = await FileUpload.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // No physical file to delete - data is stored in MongoDB
    // Remove all the filesystem operations since they don't apply

    // Delete charts associated with this file
    const deletedCharts = await Chart.deleteMany({ fileId });
    console.log(
      `Deleted ${deletedCharts.deletedCount} charts for file ${fileId}`
    );

    // Delete file record from database
    await FileUpload.findByIdAndDelete(fileId);

    res.json({
      message: "File deleted successfully",
      fileName: file.originalFileName,
      deletedCharts: deletedCharts.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get storage usage
const getStorageUsage = async (req, res) => {
  try {
    // Get all file records from database
    const files = await FileUpload.find();

    let totalSize = 0;
    let fileCount = files.length;

    // Calculate total size from fileSize field in database
    for (const file of files) {
      if (file.fileSize) {
        totalSize += file.fileSize;
      }
    }

    // Convert bytes to MB
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    res.json({
      totalSizeMB: parseFloat(totalSizeMB),
      totalSizeBytes: totalSize,
      fileCount,
      formattedSize: formatBytes(totalSize),
    });
  } catch (error) {
    console.error("Error getting storage usage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllFiles,
  deleteFile,
  getStorageUsage,
  getChartStats,
  getAllCharts,
  getChartById,
  deleteChart,
  bulkDeleteCharts,
  getDashboardOverview,
};
