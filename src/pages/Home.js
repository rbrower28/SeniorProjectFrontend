import "./Home.css";
import { useEffect, useState } from "react";
import Graph from "../components/Graph";
import Entry from "../components/Entry";
import Axios from "axios";

export default function Home() {
  const [graphParams, setGraphParams] = useState({});

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    await Axios.get(
      "https://seniorprojectbackend.onrender.com/scenario" ||
        "http://localhost:8080/scenario",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.data.populated = true;
          setGraphParams(res.data);
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log("GET REQUEST FAILED", err.response.data);
      });
  }

  return (
    <div>
      <script src="https://d3js.org/d3.v4.js"></script>
      <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
      <h1>My Cash Flow</h1>
      <Graph props={graphParams} />
      <h2>Data Entry</h2>
      <Entry props={graphParams} />
    </div>
  );
}
