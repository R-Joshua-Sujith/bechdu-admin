import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import "./CompleteOrder.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
const CompleteOrder = ({ id, orderName, isOpen, handleClose }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [finalPrice, setFinalPrice] = useState("");
  const [IMEINumber, setIMEINumber] = useState("");
  const [deviceBillImage, setDeviceBillImage] = useState(null);
  const [deviceIDCardImage, setDeviceIDCardImage] = useState(null);
  const [deviceImages, setDeviceImages] = useState([]);

  const deviceBillInputRef = useRef(null);
  const deviceIDCardInputRef = useRef(null);
  const deviceImagesInputRef = useRef(null);
  const [Loading, setLoading] = useState(false);

  const handleDeviceBillImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[1]; // Extracting file extension
      const allowedTypes = ["jpg", "jpeg", "png"];
      const fileSize = file.size;
      if (allowedTypes.includes(fileType) && fileSize <= 300 * 1024) {
        setDeviceBillImage(file);
      } else {
        // Display an error message or handle the case where the file does not meet the requirements
        if (!allowedTypes.includes(fileType)) {
          toast.warning("Device Bill image must be either JPG, JPEG, or PNG.");
        } else {
          toast.warning("Device Bill image exceeds 300kb limit.");
        }
      }
    }
  };

  const handleDeviceIDCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[1]; // Extracting file extension
      const allowedTypes = ["jpg", "jpeg", "png"];
      const fileSize = file.size;
      if (allowedTypes.includes(fileType) && fileSize <= 300 * 1024) {
        setDeviceIDCardImage(file);
      } else {
        // Display an error message or handle the case where the file does not meet the requirements
        if (!allowedTypes.includes(fileType)) {
          toast.warning("Device ID image must be either JPG, JPEG, or PNG.");
        } else {
          toast.warning("Device ID image exceeds 300kb limit.");
        }
      }
    }
  };

  const handleDeviceImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const fileType = file.type.split("/")[1]; // Extracting file extension
      const allowedTypes = ["jpg", "jpeg", "png"];
      const fileSize = file.size;
      return allowedTypes.includes(fileType) && fileSize <= 300 * 1024;
    });
    if (deviceImages.length + validFiles.length > 5) {
      toast.warning("You can upload a maximum of 5 images.");
      return;
    }
    if (validFiles.length === files.length) {
      setDeviceImages((prevImages) => [...prevImages, ...validFiles]);
    } else {
      // Display an error message or handle the case where some files do not meet the requirements
      toast.warning(
        "Device Image must be either JPG, JPEG, or PNG and not exceed 300kb limit."
      );
    }
  };

  const handleDeleteImage = (index, type) => {
    switch (type) {
      case "bill":
        setDeviceBillImage(null);
        break;
      case "idCard":
        setDeviceIDCardImage(null);
        break;
      case "device":
        setDeviceImages((prevImages) =>
          prevImages.filter((_, i) => i !== index)
        );
        break;
      default:
        break;
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (finalPrice === "") {
      toast.warning("Please fill final Price");
      return;
    }
    if (IMEINumber === "") {
      toast.warning("Please fill IMEI Number");
      return;
    }
    const deviceBill = deviceBillImage
      ? await convertToBase64(deviceBillImage)
      : null;
    const idCard = deviceIDCardImage
      ? await convertToBase64(deviceIDCardImage)
      : null;
    const deviceImagesBase64 = await Promise.all(
      deviceImages.map(convertToBase64)
    );

    if (deviceBill === null) {
      toast.warning("Please Upload Device Bill");
      return;
    }
    if (idCard === null) {
      toast.warning("Please Upload ID Card");
      return;
    }
    if (deviceImagesBase64.length === 0) {
      toast.warning("Please Upload atleast one device image");
    }
    // Send data to backend
    const deviceInfo = {
      finalPrice: finalPrice, // Your final price value,
      imeiNumber: IMEINumber, // Your IMEI number value,
      deviceBill,
      idCard,
      deviceImages: deviceImagesBase64,
    };
    setLoading(true);
    await axios
      .put(`${apiURL}/order/${id}/complete`, {
        deviceInfo,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        handleClose();
        setFinalPrice("");
        setIMEINumber("");
        setDeviceBillImage(null);
        setDeviceIDCardImage(null);
        setDeviceImages([]);
        const deviceBillInputRef = useRef(null);
        const deviceIDCardInputRef = useRef(null);
        const deviceImagesInputRef = useRef(null);
      })
      .catch((res) => {
        setLoading(false);
      });
  };

  return (
    <div>
      {isOpen && (
        <div className="order-cancel-form-container">
          <div className="order-complete-container">
            <div className="order-complete-header-container">
              <p>
                Order ID <b>{orderName}</b>
              </p>
              <CloseIcon
                className="icons"
                onClick={() => {
                  handleClose();
                  setFinalPrice("");
                  setIMEINumber("");
                  setDeviceBillImage(null);
                  setDeviceIDCardImage(null);
                  setDeviceImages([]);
                  const deviceBillInputRef = useRef(null);
                  const deviceIDCardInputRef = useRef(null);
                  const deviceImagesInputRef = useRef(null);
                }}
              />
            </div>

            <div>
              <label htmlFor="finalPrice">Final Price</label>
              <input
                type="text"
                id="finalPrice"
                name="finalPrice"
                autoComplete="off"
                value={finalPrice}
                onChange={(e) => {
                  setFinalPrice(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="imeiNumber">IMEI Number</label>
              <input
                type="text"
                id="imeiNumber"
                name="imeiNumber"
                autoComplete="off"
                value={IMEINumber}
                onChange={(e) => {
                  setIMEINumber(e.target.value);
                }}
              />
            </div>
            <div className="device-upload-container">
              <div className="single-device-upload-container">
                <label htmlFor="deviceBillImage">
                  Upload Device Bill &nbsp;
                  <AddToPhotosIcon className="icons" />
                </label>
                <input
                  type="file"
                  id="deviceBillImage"
                  name="deviceBillImage"
                  accept="image/*"
                  onChange={handleDeviceBillImageChange}
                  ref={deviceBillInputRef}
                  style={{ display: "none" }}
                />
                {deviceBillImage && (
                  <div className="device-image-single-container">
                    <img
                      src={URL.createObjectURL(deviceBillImage)}
                      alt="Device Bill Image"
                      height="50px"
                      width="50px"
                    />
                    <DeleteIcon
                      className="icons"
                      onClick={() => handleDeleteImage(null, "bill")}
                    />
                  </div>
                )}
              </div>
              <div className="single-device-upload-container">
                <label htmlFor="deviceIDCardImage">
                  Upload User ID &nbsp;
                  <AddToPhotosIcon className="icons" />
                </label>
                <input
                  type="file"
                  id="deviceIDCardImage"
                  name="deviceIDCardImage"
                  accept="image/*"
                  onChange={handleDeviceIDCardImageChange}
                  ref={deviceIDCardInputRef}
                  style={{ display: "none" }}
                />
                {deviceIDCardImage && (
                  <div className="device-image-single-container">
                    <img
                      src={URL.createObjectURL(deviceIDCardImage)}
                      alt="Device ID Card Image"
                      height="50px"
                      width="50px"
                    />
                    <DeleteIcon
                      className="icons"
                      onClick={() => handleDeleteImage(null, "idCard")}
                    />
                  </div>
                )}
              </div>
              <div className="single-device-upload-container">
                <div>
                  <label htmlFor="deviceImage">
                    Upload Device Images &nbsp;
                    <AddToPhotosIcon className="icons" />
                  </label>
                  <input
                    type="file"
                    id="deviceImage"
                    name="deviceImage"
                    accept="image/*"
                    multiple
                    onChange={handleDeviceImageChange}
                    ref={deviceImagesInputRef}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="device-images-container">
                  {deviceImages.map((image, index) => (
                    <div key={index} className="device-image-single-container">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Device Image ${index + 1}`}
                        height="50px"
                        width="50px"
                      />

                      <DeleteIcon
                        className="icons"
                        onClick={() => handleDeleteImage(index, "device")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={Loading}>
              {Loading ? "Loading..." : "Complete Order"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CompleteOrder;
