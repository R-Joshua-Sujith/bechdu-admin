import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Repeatable/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./EditPromoCode.css";

const EditPromoCode = ({ id, handleClose, isOpen }) => {
  const apiURL = process.env.REACT_APP_API_URL;

  
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [Loading, setLoading] = useState(false);
  const getData = () => {
    axios
      .get(`${apiURL}/promo/promoCode/${id}`)
      .then((res) => {
        setCode(res.data.code);
        setDiscountAmount(res.data.discountAmount);
      })
      .catch((err) => {
        toast.warning(err.response.data.error);
      });
  };

  useEffect(() => {
    getData();
  }, [id]);
  const handleSubmit = async () => {
    if (code === "" || discountAmount === "") {
      toast.warning("Please Fill all the fields");
      return;
    }
    setLoading(true);
    await axios
      .put(`${apiURL}/promo/update/promocode/${id}`, {
        code,
        discountAmount,
      })
      .then((res) => {
        setLoading(false);
        toast.success("Promo Code updated Successfully");
        console.log(res);
      })
      .catch((err) => {
        setLoading(false);
        toast.warning(err.response.data.error);
      });
  };
  return (
    <div>
      {isOpen && (
        <div className="category-edit-form-container">
          <div className="category-form-container">
            <div className="edit-pin-code-sub-container">
              <h1>
                {" "}
                <ArrowBackIcon
                  className="icons"
                  onClick={() => {
                    handleClose();
                  }}
                />
                Edit Promo Code
              </h1>
              <TextField
                sx={{ mr: 2 }}
                label="Promo Code"
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
              />
              <TextField
                sx={{ mr: 2 }}
                label="Discount Amount"
                margin="normal"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                autoComplete="off"
              />

              <br />

              <br />
              <button disabled={Loading} onClick={handleSubmit}>
                {Loading ? "Saving Changes..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPromoCode;
