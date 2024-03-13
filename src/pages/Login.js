import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

async function loginUser(email, password) {
  await Axios.post(
    'https://localhost:8080/login', {email: email, password:password}).then((response) => {
    console.log("Post request successful.")
    return response.token;
  })
 }

export default function Login({ setToken }) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(email, password);
    const token = await loginUser({
      email,
      password
    });
    // const token = "test123";
    setToken(token);
  }

  return (
    <div className="login-wrapper">
    <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input type="text" onChange={e => setEmail(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      </div>
    );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}