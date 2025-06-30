import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ReservationStepper from "./components/ReservatioinStepper/ReservationStepper";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booknow" element={<ReservationStepper />} />
        <Route path="/" element={<Navigate to="/booknow" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
