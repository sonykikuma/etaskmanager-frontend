import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const changeHandler = (e) => {
    const { name, value } = e.target;
    const copyInfo = { ...loginInfo };
    copyInfo[name] = value;
    setLoginInfo(copyInfo);
  };
  console.log(loginInfo);

  const submitHandler = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("All fields are required");
    }

    try {
      const url = "https://wokasana-backend.vercel.app/user/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      console.log(result);
      const { message, token, user } = result;
      // const { success, message, jwtToken, name, error } = result;
      if (token) {
        handleSuccess(message);
        localStorage.setItem("token", token);
        localStorage.setItem("loggedinuser", user.name);
        localStorage.setItem("loggedinuserid", user.userId);
        setTimeout(() => {
          navigate("/home", { state: { user, token } });
        }, 1000);
      } else {
        handleError("user not registered");
      }
      //else if (error) {
      //   const details = error?.details[0].message;
      //   handleError(details);
      // } else if (!success) {
      //   handleError(message);
      // }
    } catch (error) {
      handleError("invalid user");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="container  py-4 shadow"
        style={{ width: "20rem", height: "24rem" }}
      >
        <h1 className="text-center"> Workasana Login </h1>
        <form
          className="d-flex align-items-center  flex-column"
          onSubmit={submitHandler}
        >
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              placeholder="email"
              onChange={changeHandler}
              className="form-control"
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              placeholder="password"
              onChange={changeHandler}
              className="form-control"
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary">Login</button>
          <span>
            Don't have an account? <Link to="/">Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
