import React from 'react';
import { Link } from "react-router-dom";

export default function Graph() {

  return (
    <div>
      <h3>Nav</h3>
      <Link to="/">Login</Link>
      <Link to="/home">Home</Link>
    </div>
    );
}