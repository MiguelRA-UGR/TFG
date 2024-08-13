import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navegation from "./components/Navegation";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Destination from "./components/Destination";
import Profile from "./components/Profile";
import User from "./components/User";
import Notifications from "./components/Notifications";
import Footer from "./components/Footer";
import RequestForm from "./components/RequestForm";
import Forum from "./components/Forum";

function App() {
  return (
    <div className="app-container">
      <div className="content">
        <Navegation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Destination/:id" element={<Destination />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/User/:id" element={<User />} />
          <Route path="/RequestForm" element={<RequestForm />} />
          <Route path="/Forum/:id" element={<Forum />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
