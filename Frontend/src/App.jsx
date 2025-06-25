// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/LoginPage';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Register />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import store from "./redux/store";
// import { useDispatch } from "react-redux";
// import React, { useEffect } from "react";

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import RegisterPage from './pages/Register';
// import MainPage from './pages/MainPage';
// import AdminPanel from './pages/AdminPanel';
// import AuthRoute from './components/AuthRoute'; // Assuming this is a custom component
// import api from './services/api';

// function App() {
//   const dispatch = useDispatch();

//   // Check for existing token on app load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Verify token with backend and get user info
//       api.defaults.headers.common["Authorization"] = token;
//       api
//         .get("/me")
//         .then((response) => {
//           dispatch(
//             loginSuccess({
//               token,
//               user: response.data,
//             })
//           );
//         })
//         .catch(() => {
//           // Token is invalid, remove it
//           localStorage.removeItem("token");
//           delete api.defaults.headers.common["Authorization"];
//         });
//     }
//   }, [dispatch]);

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Public Routes */}
//           <Route
//             path="/"
//             element={
//               <AuthRoute>
//                 <HomePage />
//               </AuthRoute>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <AuthRoute>
//                 <LoginPage />
//               </AuthRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <AuthRoute>
//                 <RegisterPage />
//               </AuthRoute>
//             }
//           />

//           {/* Protected Routes */}
//           <Route
//             path="/main"
//             element={
//               <ProtectedRoute>
//                 <MainPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute adminOnly={true}>
//                 <AdminPanel />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback Route */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }
// export default App;

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import AdminPanel from "./pages/AdminPanel";
import AuthRoute from "./components/AuthRoute";
import { loginSuccess } from "./redux/userSlice"; // Import your action creator correctly

import FileUpload from "./components/FileUpload";
import ChartPage from "./pages/ChartPage";
import ChartPage3D from "./pages/ChartPage3D";
import HistoryPage from "./pages/HistoryPage";
import MyUploads from "./components/MyUploads";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://excel-analytics-1-sjro.onrender.com/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Token invalid or request failed");
          }
          return res.json();
        })
        .then((data) => {
          dispatch(loginSuccess({ token, user: data }));
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <AuthRoute>
                <HomePage />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <FileUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts3d"
            element={
              <ProtectedRoute>
                <ChartPage3D />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myuploads"
            element={
              <ProtectedRoute>
                <MyUploads />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
