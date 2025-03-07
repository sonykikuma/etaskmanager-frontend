import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const changeHandler = (e) => {
    const { name, value } = e.target;
    const copyInfo = { ...signup };
    copyInfo[name] = value;
    setSignup(copyInfo);
  };
  console.log(signup);

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password } = signup;
    if (!name || !email || !password) {
      return handleError("All field are required");
    }

    try {
      const url = "https://wokasana-backend.vercel.app/user/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signup),
      });
      const result = await response.json();
      console.log(result);
      // const { success, message, error } = result;
      const { message } = result;
      if (response.ok) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        handleError("check if mail already registered");
      }

      // if (success) {
      //   handleSuccess(message);
      //   setTimeout(() => {
      //     navigate("/login");
      //   }, 1000);
      // } else if (error) {
      //   const details = error?.details[0].message;
      //   handleError(details);
      // } else if (!success) {
      //   handleError(message);
      // }
    } catch (error) {
      handleError("error in signup");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container  py-3 shadow" style={{ width: "20rem" }}>
        <h1 className="text-center">WorkSync SignUp</h1>
        <form
          onSubmit={submitHandler}
          className="d-flex align-items-center justify-content-center flex-column"
        >
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={signup.name}
              onChange={changeHandler}
              placeholder="Name"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={signup.email}
              onChange={changeHandler}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              autoFocus
              value={signup.password}
              onChange={changeHandler}
              placeholder="Password"
              className="form-control"
            />
          </div>
          <button className="btn btn-primary">SignUp</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
