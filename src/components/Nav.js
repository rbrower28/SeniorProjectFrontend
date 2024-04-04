import './Nav.css';
import { useEffect, useState } from "react";
import Axios from "axios";

export default function Nav() {
  const [user, setUser] = useState('');

  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = async () => {
    await Axios.get("http://localhost:8080/account", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }).then((resp) => {
      setUser(resp.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  const removeAuth = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <span>Hello, {user}</span>
      <button className="link" onClick={removeAuth}>
        Logout
      </button>
    </div>
  );
}
