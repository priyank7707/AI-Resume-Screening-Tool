import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="container">
      {isLoggedIn ? (
        <Dashboard />
      ) : showRegister ? (
        <Register onBackToLogin={() => setShowRegister(false)} />
      ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          onCreateAccount={() => setShowRegister(true)}
        />
      )}
    </div>
  );
}

export default App;