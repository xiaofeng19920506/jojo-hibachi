import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeNav from "./components/HomeNav/HomeNav";
import AuthInitializer from "./components/AuthInitializer/AuthInitializer";

const SignIn = lazy(() => import("./pages/Auth/SignIn"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const ReservationStepper = lazy(
  () => import("./components/ReservatioinStepper/ReservationStepper")
);
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const EmployeeCalendar = lazy(() => import("./pages/Calendar"));
const ReservationDetail = lazy(
  () => import("./pages/Reservation/ReservationDetail")
);

const App: React.FC = () => {
  return (
    <AuthInitializer>
      <Router>
        <Routes>
          <Route
            path="/signin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SignIn />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SignUp />
              </Suspense>
            }
          />
          <Route
            path="/booknow"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ReservationStepper />
              </Suspense>
            }
          />
          <Route path="/" element={<HomeNav />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <EmployeeCalendar />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ReservationDetail />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </AuthInitializer>
  );
};

export default App;
