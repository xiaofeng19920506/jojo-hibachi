import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeNav from "./components/HomeNav/HomeNav";
import AuthInitializer from "./components/AuthInitializer/AuthInitializer";
import LoadingSpinner from "./components/LoadingSpinner";
import GlobalAppBar from "./components/GloabalAppBar/GlobalAppBar";
import SSEConnection from "./components/SSEConnection/SSEConnection";
import NotificationHandler from "./components/NotificationHandler/NotificationHandler";

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
const MenuPage = lazy(() => import("./pages/Menu/MenuPage"));
const CheckoutPage = lazy(() => import("./pages/Menu/CheckoutPage"));

interface AppProps {
  themeMode?: string;
  setThemeMode?: (mode: string) => void;
}

const App: React.FC<AppProps> = ({ themeMode, setThemeMode }) => {
  const location = useLocation();

  const getAppBarProps = () => {
    if (location.pathname === "/booknow") {
      return {
        title: "Book Now",
        subtitle: "Make your reservation",
      };
    }
    if (location.pathname === "/profile") {
      return {
        title: "Profile",
        subtitle: "Manage your account",
      };
    }
    if (location.pathname === "/calendar") {
      return {
        title: "Weekly Calendar",
        subtitle: "View reservations",
      };
    }
    if (
      location.pathname.startsWith("/reservation/") &&
      !location.pathname.includes("/menu")
    ) {
      return {
        title: "Fancy Hibachi",
        subtitle: "",
      };
    }
    if (location.pathname.includes("/menu")) {
      return {
        title: "Menu Selection",
        subtitle: "Choose your dishes",
      };
    }
    return {
      title: "Dashboard",
      subtitle: undefined,
    };
  };

  const { title, subtitle } = getAppBarProps();

  return (
    <AuthInitializer>
      <SSEConnection />
      <NotificationHandler showSnackbar={true} showNotificationList={false} />
      <GlobalAppBar
        title={title}
        subtitle={subtitle}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
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
          path="/reservation/:reservationId/menu"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <MenuPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservation/:reservationId/checkout"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <CheckoutPage />
              </Suspense>
            </ProtectedRoute>
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
    </AuthInitializer>
  );
};

export default App;
