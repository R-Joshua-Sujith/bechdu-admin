import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../Repeatable/Loader";

const ViewAbandoned = ({ id, isOpen, handleClose }) => {
  const [data, setData] = useState({});
  const [Loading, setLoading] = useState(false);
  const apiURL = process.env.REACT_APP_API_URL;
  const getData = async () => {
    setLoading(true);
    await axios
      .get(`${apiURL}/abundant/single-orders/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const formatCreatedAt = (createdAt) => {
    return new Date(createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata", // Indian Standard Time
    });
  };

  return (
    <div>
      {isOpen && (
        <div className="category-edit-form-container">
          {Loading ? (
            <Loader />
          ) : (
            <div className="category-form-container">
              <h1>
                <ArrowBackIcon
                  className="icons"
                  onClick={() => {
                    handleClose();
                  }}
                />
                Order Data
              </h1>
              <div className="user-details-main-container">
                <div>
                  <h4>User Details</h4>
                  <div className="personal-details-container">
                    <p>
                      <b>Name : </b> {data?.user?.name}
                    </p>
                    <p>
                      <b>Email : </b> {data?.user?.email}
                    </p>
                    <p>
                      <b>Phone : </b> {data?.order?.user?.phone}
                    </p>
                    <p>
                      <b>Additional Phone : </b> {data?.user?.addPhone}
                    </p>
                    <p>
                      <b>City : </b> {data?.order?.user?.city}
                    </p>
                    <p>
                      <b>pincode : </b> {data?.order?.user?.pincode}
                    </p>
                    <p>
                      <b>Created At : </b>{" "}
                      {formatCreatedAt(data?.order?.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4>Product Details</h4>
                  <div className="personal-details-container">
                    <p>
                      <b>Product : </b> {data?.order?.productDetails?.name}
                    </p>
                    <p>
                      <b>Calculated Price</b> :{" "}
                      {data?.order?.productDetails?.price}{" "}
                    </p>
                    <h4>Options Selected</h4>
                    {data?.order?.productDetails?.options?.map((item) => (
                      <span>
                        {item.description} {item.value === true ? "Yes" : ""}
                        {item.value === false ? "No" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAbandoned;
