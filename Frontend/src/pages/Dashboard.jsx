import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl">Welcome, {user?.name || "User"}!</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
