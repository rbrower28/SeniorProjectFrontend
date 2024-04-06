import "./Auth.css";
import logo from "../assets/logo-darkmode.png";
import React, { useState } from "react";
import Axios from "axios";
import { validateCredentials } from "../utils/validate";
import { config } from '../constants';
const backendUrl = config.backendUrl;

async function registerUser(email, password) {
  let respToken = null;

  await Axios.post(backendUrl + "account", {
    email: email,
    password: password,
  })
    .then((res) => {
      if (res.status === 201) {
        respToken = res.data;
      }
    })
    .catch((err) => {
      console.log(err.response.data);
    });

  return respToken;
}

async function loginUser(email, password) {
  let respToken = null;

  await Axios.post(backendUrl + "login", {
    email: email,
    password: password,
  })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        respToken = res.data;
      }
    })
    .catch((err) => {
      console.log(err.response.data);
    });

  return respToken;
}

export default function Auth() {
  const [register, setRegister] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [formShake, setFormShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errs = [];
    validateCredentials(email, password, errs);

    if (errs.length === 0) {
      register
        ? await registerUser(email, password).then((token) => {
          if (token) {
            localStorage.setItem("token", token);
            window.location.reload();
          } else {
            errs.push("Account already exists.");
          }
        })
        : await loginUser(email, password).then((token) => {
          if (token) {
            localStorage.setItem("token", token);
            window.location.reload();
          } else {
            errs.push("Username or password is incorrect.");
          }
        });
    }

    if (errs.length > 0) {
      setFormShake(true);
    }
    setErrors(errs);
  };

  const changeForm = () => {
    setRegister(!register);
    setErrors([]);
  };

  return (
    <div className="auth">
      <img className="loginlogo" src={logo} alt="Obsidian Finance Logo" />
      <form
        onSubmit={handleSubmit}
        className={formShake ? "shake" : ""}
        onAnimationEnd={(e) => setFormShake(false)}
      >
        <h1>{register ? "Create an Account" : "Please Log In"}</h1>
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <label>
          <p>Email</p>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="action">
          <button type="submit">Submit</button>
        </div>
      </form>
      <div>
        {register ? "Have an account?" : "Don't have an account?"}{" "}
        <button className="link" onClick={changeForm}>
          {register ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
