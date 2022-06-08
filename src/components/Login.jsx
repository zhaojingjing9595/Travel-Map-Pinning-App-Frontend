import React, { useRef, useState } from "react";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import "./login.css";
import axios from "axios";

function Login({ setShowLogin, setCurrentUser }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  async function handleLogin(e) {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    const newUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        newUser
      );
        console.log(response.data);
        localStorage.setItem("user", response.data.username);
        setCurrentUser(response.data.username);
        setShowLogin(false)
      setSuccess(true);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }
  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        LamaPin
      </div>
      <form>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn" onClick={handleLogin}>
          Login
        </button>
        {success && <span className="success">Successful login! </span>}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}

export default Login;
