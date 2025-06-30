import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ReservationStepper from "./components/ReservatioinStepper/ReservationStepper";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<ReservationStepper />} />
      </Routes>
    </Router>
  );
};

export default App;
