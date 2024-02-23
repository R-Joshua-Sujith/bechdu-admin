import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Repeatable/Nav";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./AddPromCode.css";

const AddPromoCode = () => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [Loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code === " " || discountAmount === "") {
      toast.warning("Please fill all the fields");
      return;
    }
    setLoading(true);
    await axios
      .post(`${apiURL}/promo/create/promocode`, {
        code,
        discountAmount,
      })
      .then((response) => {
        setLoading(false);
        toast.success("Promo Code Added Successfully");
        setCode("");
        setDiscountAmount("");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.error);
      });
  };

  return (
    <div>
      <Nav />
      <div className="main-container">
        <div className="add-pincode-small-container">
          <h1>
            {" "}
            <ArrowBackIcon
              className="icons"
              onClick={() => {
                navigate("/view-promo-code");
              }}
            />
            Add Promo Code
          </h1>
          <form onSubmit={handleSubmit}>
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
            <button disabled={Loading}>
              {Loading ? "Creating..." : "Create PromoCode"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPromoCode;
