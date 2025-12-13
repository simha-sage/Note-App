import LoginPage from "./components/Signin";
import SignupPage from "./components/Signup";
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./components/dashboard";

function App() {
  const [isSignup, setIsSignup] = React.useState(false);
  return (
    <Routes>
      <Route
        path="/"
        element={
          isSignup ? (
            <SignupPage setIsSignup={setIsSignup} />
          ) : (
            <LoginPage setIsSignup={setIsSignup} />
          )
        }
      />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
