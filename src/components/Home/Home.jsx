import React from "react";
import Nav from "../Repeatable/Nav";
import { Category } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Repeatable/Loader";
const Home = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate("");
  const [data, setData] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;
  const getData = () => {
    setLoading(true);
    axios
      .get(`${apiURL}/statistic/documentCount`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.warning(err.response.data.error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Nav />
      <div className="main-container">
        {Loading ? (
          <Loader />
        ) : (
          <div className="stats-container">
            {data.map((item) => (
              <div
                className="stats-card"
                onClick={() => {
                  navigate(`${item.route}`);
                }}
              >
                <h1 className="stats-count">{item.count}</h1>
                <h3 className="stats-heading">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
