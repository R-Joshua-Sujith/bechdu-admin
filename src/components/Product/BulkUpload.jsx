import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import "../Category/Custom.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Nav from "../Repeatable/Nav";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulkUpload = () => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.token);
  const [categoryType2, setCategoryType2] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [file, setFile] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadingLoading, setUploadingLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${apiURL}/api/category/get-all-category-types`)
      .then((response) => {
        console.log(response.data);
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const generateExcelTemplate = async () => {
    if (categoryType === "") {
      toast.warning("Please select a category");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/product/generate-excel/${categoryType}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "excel_template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      console.error("Error generating Excel template:", error.message);
      setLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    try {
      if (categoryType2 === "") {
        toast.warning("Please select a category");
        return;
      }
      setDownloadLoading(true);
      const response = await axios.get(
        `${apiURL}/product/api/products/bulk-download/${categoryType2}`,
        { responseType: "blob" }
      );
      setDownloadLoading(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bulk_download.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setDownloadLoading(false);
      console.error("Error downloading file:", error);
      toast.warning("An error occurred. Please try again later.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingLoading(true);
      const response = await axios.post(
        `${apiURL}/product/api/products/bulk-upload`,
        formData
      );

      if (response.status === 200) {
        setUploadingLoading(false);
        setFile(null);
        fileInputRef.current.value = null;
        toast.success("File uploaded successfully!");
      } else {
        setUploadingLoading(false);
        toast.error("File upload failed. Please try again.");
      }
    } catch (error) {
      setUploadingLoading(false);
      console.error("Error uploading file:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  return (
    <div>
      <Nav />
      <div className="main-container">
        <h1>
          <ArrowBackIcon
            className="icons"
            onClick={() => {
              navigate("/view-product");
            }}
          />
          Bulk Actions
        </h1>
        <div className="view-products-header-container">
          <div>
            <Select
              size="small"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Select Category" }}
              sx={{ marginRight: 2, padding: 0, fontSize: 12, mb: 2 }}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categoryData.map((item) => (
                <MenuItem key={item.category_type} value={item.category_type}>
                  {item.category_type}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              onClick={generateExcelTemplate}
              disabled={loading}
              sx={{
                backgroundColor: "#36383a",
                padding: 1,
                fontSize: 10,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#36383a",
                },
              }}
            >
              {loading ? "Generating..." : "Generate Excel Template"}
            </Button>
          </div>

          <div>
            <Select
              size="small"
              value={categoryType2}
              onChange={(e) => setCategoryType2(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Select Category" }}
              sx={{ marginRight: 2, mb: 4, mt: 2, padding: 0, fontSize: 12 }}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categoryData.map((item) => (
                <MenuItem key={item.category_type} value={item.category_type}>
                  {item.category_type}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              onClick={handleBulkDownload}
              disabled={downloadLoading}
              sx={{
                backgroundColor: "#36383a",
                padding: 1,
                fontSize: 10,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#36383a",
                },
              }}
            >
              {downloadLoading
                ? "Generating..."
                : "Download Entire Product Data"}
            </Button>
          </div>
          <div>
            <input
              className="inputfile"
              type="file"
              name="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button
              variant="contained"
              disabled={uploadingLoading}
              onClick={handleUpload}
              sx={{
                ml: 2,
                backgroundColor: "#36383a",
                padding: 1,
                fontSize: 10,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#36363a",
                },
              }}
            >
              {uploadingLoading ? "Uploading..." : "Bulk Upload Products"}
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BulkUpload;
