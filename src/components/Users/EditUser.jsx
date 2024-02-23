import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import axios from "axios";
import "./EditUser.css";
import Loader from "../../components/Repeatable/Loader";
const EditUser = ({ id, isOpen, handleClose }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [data, setData] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const getData = () => {
    setLoading(true);
    axios
      .get(`${apiURL}/user/get-user-info-id/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data.user);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getOrderData = () => {
    setLoading(true);
    axios
      .get(`${apiURL}/order/get-user-orders/${data.phone}`)
      .then((res) => {
        setLoading(false);
        console.log(res.data.orders);
        setOrderData(res.data.orders);
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

  useEffect(() => {
    if (data.phone) {
      getOrderData();
    }
  }, [data]);
  return (
    <div>
      {isOpen && (
        <div className="category-edit-form-container">
          {Loading ? (
            <Loader />
          ) : (
            <div className="category-form-container">
              <h1>
                {" "}
                <ArrowBackIcon
                  className="icons"
                  onClick={() => {
                    handleClose();
                  }}
                />
                View User
              </h1>

              <div className="user-details-main-container">
                <div>
                  <h4>Personal Details</h4>
                  <div className="personal-details-container">
                    <p>
                      <b>Name : </b>
                      {data.name}
                    </p>
                    <p>
                      <b>Email : </b>
                      {data.email}
                    </p>
                    <p>
                      <b>Phone : </b> {data.phone}
                    </p>
                    <p>
                      <b>Additional Phone : </b> {data.addPhone}
                    </p>
                    <p>
                      <b>City : </b>
                      {data.city}
                    </p>
                    <p>
                      <b>Pincode : </b>
                      {data.pincode}
                    </p>
                  </div>
                </div>

                <div>
                  <h4>Saved Address</h4>
                  {data.address && data.address.length > 0 ? (
                    <div className="address-container">
                      {data.address &&
                        data.address.map((item, index) => (
                          <p className="user-address" key={index}>
                            {item}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <h4>User has not saved any address</h4>
                  )}
                </div>
              </div>

              <div className="user-details-container">
                <h4>Orders Placed</h4>
                {orderData.length > 0 ? (
                  <div className="user-orders-main-container">
                    {orderData.map((item) => (
                      <div className="user-orders-container">
                        <b>{item.orderId}</b>
                        <p>Product {item.productDetails.name}</p>
                        <p>Rs {item.productDetails.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h4>User has not placed any orders yet</h4>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditUser;
