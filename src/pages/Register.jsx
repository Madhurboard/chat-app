import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #0f0f0f, #131324); /* Dark gradient background */
  color: white;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1 {
      color: transparent;
      font-size: 3rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 5px;
      background: linear-gradient(90deg, #4e0eff, #997af0);
      -webkit-background-clip: text; /* Clipping the gradient to the text */
      background-clip: text;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4); /* Adding subtle shadow */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #1f1f1f;
    border-radius: 1.5rem;
    padding: 3rem;
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.5);
    width: 350px;
    backdrop-filter: blur(10px); /* Slight blur effect for a modern look */
  }

  input {
    background-color: #2a2a2a;
    padding: 1rem;
    border: 0.1rem solid #6a6a6a;
    border-radius: 0.5rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    &:focus {
      border: 0.1rem solid #4e0eff;
      outline: none;
      box-shadow: 0 0 5px rgba(78, 14, 255, 0.5);
    }
    &:hover {
      border-color: #4e0eff;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(78, 14, 255, 0.2);
    &:hover {
      background-color: #997af0;
      transform: scale(1.05); /* Slight scale-up effect */
    }
    &:active {
      background-color: #4e0eff;
      transform: scale(0.98); /* Slight scale-down effect on click */
    }
  }

  span {
    color: white;
    text-align: center;
    font-size: 0.9rem;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
      &:hover {
        color: #997af0;
      }
    }
  }
`;
