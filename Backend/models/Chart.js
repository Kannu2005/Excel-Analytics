// const mongoose = require('mongoose');

// const chartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   fileId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'FileUpload',
//     required: true
//   },
//   chartName: {
//     type: String,
//     required: true
//   },
//   chartType: {
//     type: String,
//     enum: ['bar', 'line', 'pie', 'scatter', 'column3d'],
//     required: true
//   },
//   xAxis: {
//     type: String,
//     required: true
//   },
//   yAxis: {
//     type: String,
//     required: true
//   },
//   chartData: {
//     type: mongoose.Schema.Types.Mixed,
//     required: true
//   },
//   createdDate: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Chart', chartSchema);


//////////////////////////////////////////////////
const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileUpload',
    required: true
  },
  chartName: {
    type: String,
    required: true,
    trim: true
  },
  chartType: {
    type: String,
    enum: [
      // 2D Chart types
      'bar', 'line', 'pie', 'scatter', 'column',
      // 3D Chart types
      'bar3d', 'line3d', 'pie3d', 'scatter3d', 'surface3d', 'column3d'
    ],
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  zAxis: {
    type: String,
    required: false, // Optional for 3D charts
    default: null
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

// Add index for better query performance
chartSchema.index({ userId: 1, createdAt: -1 });
chartSchema.index({ userId: 1, chartType: 1 });

module.exports = mongoose.model('Chart', chartSchema);