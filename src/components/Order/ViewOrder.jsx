import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../Repeatable/Loader";

const ViewOrder = ({ id, isOpen, handleClose }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [data, setData] = useState({});
  const [Loading, setLoading] = useState(false);
  const getData = () => {
    setLoading(true);
    axios
      .get(`${apiURL}/order/get-order/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data.data);
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

  return (
    <div>
      {isOpen && (
        <div>
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
                  Order ID {data.orderId}
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
                        <b>Phone : </b> {data?.user?.phone}
                      </p>

                      <p>
                        <b>Additional Phone : </b> {data?.user?.addPhone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4>PickUp Details</h4>
                    <div className="personal-details-container">
                      <p>
                        <b>Pickup date : </b>
                        {data?.pickUpDetails?.date}
                      </p>
                      <p>
                        <b>Pickup time : </b>
                        {data?.pickUpDetails?.time}
                      </p>
                      <p>
                        <b>Pick Up Address</b> : {data?.user?.address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4>Status Details</h4>
                    <div className="personal-details-container">
                      <p>
                        <b>Status : </b>
                        {data.status}
                      </p>
                      {data.status === "cancelled" ? (
                        <p>
                          <b>Cancellation Reason : </b>{" "}
                          {data.cancellationReason}
                        </p>
                      ) : (
                        ""
                      )}
                      <p>
                        <b>Created At : </b>
                        {data.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="user-details-main-container">
                  <div>
                    <h4>Payment Details</h4>
                    <div className="personal-details-container">
                      <p>
                        <b>Payment Type : </b> {data?.payment?.type}
                      </p>
                      {data?.payment?.type === "upi" && (
                        <p>
                          <b>UPI ID : </b> {data?.payment?.id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4>Product Details</h4>
                    <div className="personal-details-container">
                      <p>
                        <b>Product : </b> {data?.productDetails?.name}
                      </p>
                      <p>
                        <b>Calculated Price :</b> {data?.productDetails?.price}
                      </p>
                      <p>
                        <p>
                          <b>Promo Code : </b>
                          {data?.promo?.code}
                        </p>
                        <p>
                          <b>Promo Price:</b> Rs {data?.promo?.price}
                        </p>
                      </p>

                      <h4>Options Selected</h4>
                      {data?.productDetails?.options.map((item) => (
                        <span>
                          {item.description} {item.value === true ? "Yes" : ""}
                          {item.value === false ? "No" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.status === "Completed" && (
                    <div>
                      <h4>Order Completed Details</h4>
                      <div className="personal-details-container">
                        <p>
                          <b>Final Price : </b> {data?.deviceInfo?.finalPrice}
                        </p>
                        <p>
                          <b>IMEI Number :</b> {data?.deviceInfo?.imeiNumber}
                        </p>
                        <div className="device-images-container">
                          <div>
                            <b>Device Bill : </b>
                            <img
                              src={data?.deviceInfo?.deviceBill}
                              alt=""
                              width="100px"
                              height="100px"
                            />
                          </div>
                          <div>
                            <b>User ID Card</b>
                            <img
                              src={data?.deviceInfo?.idCard}
                              alt=""
                              width="100px"
                              height="100px"
                            />
                          </div>
                        </div>
                        <br />
                        <div>
                          <b>Device Images :</b>
                          <div className="device-images-container">
                            {data?.deviceInfo?.deviceImages.map((item) => (
                              <img src={item} width="100px" height="100px" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
