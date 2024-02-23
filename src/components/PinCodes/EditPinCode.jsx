import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "./EditPinCode.css";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Repeatable/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const EditPinCode = ({ id, handleClose, isOpen }) => {
  const apiURL = process.env.REACT_APP_API_URL;

  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pinCodes, setPinCodes] = useState("");
  const [Loading, setLoading] = useState(false);
  const [pinCodeLoading, setPinCodeLoading] = useState(false);
  const getPinCodeData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${apiURL}/pincode/get-pincode/${id}`)
        .then((response) => {
          setLoading(false);
          setStateName(response.data.stateName);
          setCityName(response.data.cityName);
          setPinCodes(response.data.pinCodes.join(","));
        });
    } catch (err) {
      setLoading(false);
      alert(response.data.error);
    }
  };
  useEffect(() => {
    if (id) getPinCodeData();
  }, [id]);
  const handleSubmit = async (e) => {
    console.log(stateName, cityName, pinCodes);
    e.preventDefault();

    if (stateName === "" || cityName === "" || pinCodes === "") {
      alert("Please enter all the fields");
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
      const response = await axios.put(
        `${apiURL}/pincode/update-pincode/${id}`,
        formData
      );
      setLoading(false);
      // Handle the response data as needed
      toast.success("PinCode Edited Successfully");

      console.log("Pincode added:", response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };
  return (
    <div>
      {isOpen && (
        <div className="category-edit-form-container">
          {Loading ? (
            <Loader />
          ) : (
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
                  Edit Pincode
                </h1>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="State"
                    value={stateName}
                    onChange={(e) => {
                      setStateName(e.target.value);
                    }}
                  />
                  <br />
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
                    }}
                    defaultValue={pinCodes}
                    onChange={(e) => setPinCodes(e.target.value)}
                  />
                  <br />
                  <button type="submit" disabled={Loading}>
                    {Loading ? "Saving Changes..." : "Save Category"}
                  </button>
                </form>
              </div>
              <ToastContainer />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditPinCode;
