import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeNav from "./components/HomeNav/HomeNav";
import AuthInitializer from "./components/AuthInitializer/AuthInitializer";
import LoadingSpinner from "./components/LoadingSpinner";

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
const Profile = lazy(() => import("./pages/Auth/Profile"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const ResetPasswordResult = lazy(
  () => import("./pages/Auth/ResetPasswordResult")
);

const App: React.FC = () => {
  return (
    <AuthInitializer>
      <Router>
        <Routes>
          <Route
            path="/signin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SignIn />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SignUp />
              </Suspense>
            }
          />
          <Route
            path="/booknow"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ReservationStepper />
              </Suspense>
            }
          />
          <Route path="/" element={<HomeNav />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <EmployeeCalendar />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ReservationDetail />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <Profile />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/reset-password-result"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ResetPasswordResult />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </AuthInitializer>
  );
};

export default App;
