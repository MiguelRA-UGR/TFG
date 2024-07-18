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

function App() {
  return (
    <div className="">
      <div className="container p-2" style={{ position: "relative" }}>
        <Navegation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Destination/:id" element={<Destination />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/User/:id" element={<User />} />
          <Route path="/RequestForm" element={<RequestForm />} />
        </Routes>
      </div>
      
    </div>
  );
}

export default App;
