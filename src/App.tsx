import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Menu from "./pages/Menu/Menu";
import Gallery from "./pages/Gallery/Gallery";
import FAQ from "./pages/FAQ/FAQ";
import Contact from "./pages/Contact/Contact";
import BookNow from "./pages/BookNow/BookNow";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booknow" element={<BookNow />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
