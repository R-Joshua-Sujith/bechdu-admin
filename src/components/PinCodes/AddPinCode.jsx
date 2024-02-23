import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./AddPinCode.css";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Repeatable/Nav";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
const AddPinCode = () => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pinCodes, setPinCodes] = useState("");
  const [Loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (stateName === "" || cityName === "" || pinCodes === "") {
      toast.warning("Please enter all the fields");
      return;
    }

    // Convert pinCodes to an array
    const pinCodesArray = pinCodes.split(",").map((code) => code.trim());

    // Prepare the data to be submitted
    const formData = {
      stateName,
      cityName,
      pinCodes: pinCodesArray,
    };
    try {
      setLoading(true);
      // Use Axios to add pin code
      const response = await axios.post(
        `${apiURL}/pincode/create/pincode`,
        formData
      );
      setLoading(false);
      // Handle the response data as needed
      toast.success("PinCode Added Successfully");
      setStateName("");
      setCityName("");
      setPinCodes("");
      console.log("Pincode added:", response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
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
                navigate("/view-pincode");
              }}
            />
            Add Pincode
          </h1>
          <form onSubmit={handleSubmit}>
            <TextField
              sx={{ mr: 2 }}
              label="State Name"
              margin="normal"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
            <TextField
              label="City Name"
              margin="normal"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <br />
            <TextareaAutosize
              minRows={3}
              placeholder="Pin Codes (comma-separated)"
              style={{
                width: "100%",
                marginTop: "16px",
                fontSize: "18px",
                height: "200px",
              }}
              value={pinCodes}
              onChange={(e) => setPinCodes(e.target.value)}
            />
            <br />
            <button disabled={Loading}>
              {Loading ? "Creating..." : "Create Pincode"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPinCode;
