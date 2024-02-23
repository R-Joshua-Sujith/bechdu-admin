import React, { useEffect, useState } from "react";
import "./CancelOrder.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CancelOrder = ({ id, orderName, isOpen, handleClose }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [cancellationReason, setCancellationReason] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(id);
  }, [id]);
  const cancelOrder = async () => {
    if (cancellationReason.length < 10) {
      toast.warning("Cancellation Reason must have at least 10 characters");
      return;
    }
    setLoading(true);
    await axios
      .put(`${apiURL}/order/${id}/cancel`, {
        cancellationReason,
      })
      .then((res) => {
        toast.info(res.data.message);
        setLoading(false);
        setCancellationReason("");
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        toast.warning("Sever Error");
      });
  };
  return (
    <div>
      {isOpen && (
        <div className="order-cancel-form-container">
          <div className="order-cancel-container">
            <p>
              Order ID <b>{orderName}</b>
            </p>
            <textarea
              type="text"
              placeholder="Enter Cancellation reason to cancel the order"
              value={cancellationReason}
              onChange={(e) => {
                setCancellationReason(e.target.value);
              }}
            />
            <div className="order-cancel-btn-container">
              {" "}
              <button onClick={cancelOrder} disabled={loading}>
                {loading ? "Cancelling..." : "Submit"}
              </button>
              <button
                onClick={() => {
                  setCancellationReason("");
                  handleClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CancelOrder;
