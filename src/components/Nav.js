import "./Nav.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import logo from "../assets/logo-darkmode.png";

export default function Nav() {
  const [user, setUser] = useState("");

  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = async () => {
    await Axios.get(
      "https://seniorprojectbackend.onrender.com/account" ||
        "http://localhost:8080/account",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((resp) => {
        setUser(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeAuth = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <a href="/">
        <img className="logo" src={logo} alt="Obsidian Finance Logo" />
      </a>
      <div className="links">
        <span>Hello, {user}</span>
        <button className="link" onClick={removeAuth}>
          Logout
        </button>
      </div>
    </div>
  );
}
