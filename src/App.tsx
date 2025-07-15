import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ReservationStepper from "./components/ReservatioinStepper/ReservationStepper";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeNav from "./components/HomeNav/HomeNav";
import AuthInitializer from "./components/AuthInitializer/AuthInitializer";
import EmployeeCalendar from "./pages/Calendar";

const App: React.FC = () => {
  return (
    <AuthInitializer>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booknow" element={<ReservationStepper />} />
          <Route path="/" element={<HomeNav />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <EmployeeCalendar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthInitializer>
  );
};

export default App;
