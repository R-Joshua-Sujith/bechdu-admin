import React from "react";
import Nav from "../Repeatable/Nav";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextField } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useState } from "react";

const AddPartner = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincodes, setPincodes] = useState([]);
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
                navigate("/view-partner");
              }}
            />
            Add Partner
          </h1>
          <div>
            <TextField
              label="Partner Name"
              size="small"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              autoComplete="off"
            />
            <TextField
              label="Phone"
              size="small"
              sx={{ ml: 2 }}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              autoComplete="off"
            />
            <TextField
              label="Email"
              size="small"
              sx={{ ml: 2 }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoComplete="off"
            />
            <br />
            <TextField
              label="Address"
              size="small"
              sx={{ mt: 2, width: 700 }}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              autoComplete="off"
            />

            <TextareaAutosize
              minRows={3}
              placeholder="Pin Codes (comma-separated)"
              style={{
                width: "100%",
                marginTop: "16px",
                fontSize: "18px",
                height: "400px",
                padding: "10px",
              }}
              autoComplete="off"
              value={pincodes}
              
            />
            <br />
            <button>Create Partner</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPartner;
