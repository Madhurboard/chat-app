import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/HomePage"; // Adjust the path if Homepage is located in another folder
import Login from "./pages/Login"; // Example: Login page
import SetAvatar from "./components/SetAvatar"; // Example: SetAvatar page
import ChatContainer from "./components/ChatContainer"; // Example: ChatContainer page
import ProfilePage from "./components/ProfilePage";
import Register from "./pages/Register"; // Example: Register page


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage Route */}
        <Route path="/" element={<Homepage />} />

        {/* Other Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/chatContainer" element={<ChatContainer />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Redirect Unmatched Routes to Homepage */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
