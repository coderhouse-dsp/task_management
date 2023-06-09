import React, { useState, useEffect } from "react";
import { Router, navigate } from "@reach/router";
import Swal from "sweetalert2";
// import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Content from "./components/Content";
import Dashboard from "./components/TaskSection/Dashboard";
import Profile from "./components/TaskSection/Profile";
// import Navbar from "./components/TaskSection/Navbar";
export const UserContext = React.createContext([]);
function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallback = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include", // Needed to include the cookie
    });
    Swal.fire({
      icon: "success",
      title: "Yay...",
      text: "Logged out successfully !",
      confirmButtonColor: "#008000",
    });
    // Clear user from context
    setUser({});
    // Navigate back to startpage
    navigate("/");
  };

  // First thing, check if a refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (
        await fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include", // Needed to include the cookie
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setUser({
        accesstoken: result.accesstoken,
      });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading ...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <>
        {/* <Navigation logOutCallback={logOutCallback} /> */}
        <Router id="router">
          <Login path="login" />
          <Register path="register" />
          <Protected path="protected" logOutCallback={logOutCallback} />
          <Content path="/" />
          <Dashboard path="/dashboard"></Dashboard>
          <Profile path="protected/profile" />
        </Router>
      </>
    </UserContext.Provider>
  );
}

export default App;
