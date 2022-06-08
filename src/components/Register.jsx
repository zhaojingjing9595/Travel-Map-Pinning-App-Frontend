import React, { useRef, useState } from "react";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import "./Register.css";
import axios from "axios";

function Register({setShowRegister, setCurrentUser}) {
  const [success, setSuccess] = useState(false);
    const [ error, setError ] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    async function handleRegister(e) {
        e.preventDefault();
        setSuccess(false);
        setError(false)
      const newUser = {
        username: nameRef.current.value,
        password:passwordRef.current.value,
        email:emailRef.current.value,
      };
      try {
        const response = await axios.post(
          "https://travel-map-pinning-app-server.herokuapp.com/api/users/register",
          newUser
        );
          console.log(response.data)
          setShowRegister(false);
          localStorage.setItem("user",response.data.username);
          setCurrentUser(response.data.username);
        setSuccess(true);
      } catch (error) {
        setError(true);
        console.log(error);
      }
    }
  return (
    <div className="registerContainer">
      <div className="registerLogo">
        <RoomIcon />
        LamaPin
      </div>
      <form>
        <input
          type="text"
          placeholder="username"
          ref={nameRef}
        />
        <input
          type="email"
          placeholder="email"
         ref={emailRef}
        />
        <input
          type="password"
          placeholder="password"
        ref={passwordRef}
        />
        <button className="registerBtn" onClick={handleRegister}>
          Register
        </button>
        {success && <span className="success">Successful! You can Login now!</span>}
        {error && <span className="failure">Something went wrong!</span>}
          </form>
          <CancelIcon className="registerCancel" onClick={()=>setShowRegister(false) }/>
    </div>
  );
}

export default Register;
