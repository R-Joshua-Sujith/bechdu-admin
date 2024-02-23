import React, { useState, useRef } from "react";
import "./EditProduct.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Repeatable/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const EditProduct = ({ id, handleClose, isOpen }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const fileInputRef = useRef(null);
  const [Loading, setLoading] = useState(false);
  const [productName, setProductName] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [variant, setVariant] = useState("");
  const [modelData, setModelData] = useState([]);
  const [model, setModel] = useState("");
  const [options, setOptions] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productImageURL, setProductImageURL] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [bestSelling, setBestSelling] = useState("false");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [slug, setSlug] = useState("");
  const handleBestSellingChange = (event) => {
    setBestSelling(event.target.value);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImageURL(URL.createObjectURL(file));
    setProductImage(e.target.files[0]);
  };
  const getProductData = async () => {
    try {
      setLoading(true);
      await axios.get(`${apiURL}/product/products/${id}`).then((response) => {
        console.log(response.data);
        setLoading(false);
        setBasePrice(response.data.basePrice);
        setVariant(response.data.variant);
        setCategoryType(response.data.categoryType);
        setBrandName(response.data.brandName);
        setSeriesName(response.data.seriesName);
        setEstimatedPrice(response.data.estimatedPrice);
        setModel(response.data.model);
        setOptions(response.data.dynamicFields);
        setBestSelling(response.data.bestSelling);
        setSlug(response.data.slug);
        setImageUrl(`${apiURL}/uploads/${response.data.productImage}`);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert(err.response.data.error);
    }
  };
  useEffect(() => {
    if (id) getProductData();
  }, [id]);

  //   useEffect(() => {
  //     axios
  //       .get("https://selligo-backend.onrender.com/get-all-category-types")
  //       .then((response) => {
  //         console.log(response.data);
  //         setCategoryData(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }, []);

  //   useEffect(() => {
  //     axios
  //       .get(
  //         `https://selligo-backend.onrender.com/brands-category/${categoryType}`
  //       )
  //       .then((response) => {
  //         console.log(response.data);
  //         setBrandData(response.data);
  //       })
  //       .catch((error) => {
  //         setBrandData([]);
  //         console.log(error.response.data.error);
  //       });
  //   }, [categoryType]);

  //   useEffect(() => {
  //     axios
  //       .get(
  //         `https://selligo-backend.onrender.com/series/${brandName}/${categoryType}`
  //       )
  //       .then((response) => {
  //         console.log(response.data);
  //         setSeriesData(response.data);
  //       })
  //       .catch((error) => {
  //         setSeriesData([]);
  //         console.log(error.response.data.error);
  //       });
  //   }, [categoryType, brandName]);

  const submit = async () => {
    if (basePrice === "" || estimatedPrice === "") {
      toast.warning("please fill  price");
      return;
    }

    if (variant === "") {
      toast.warning("Please fill the variant");
      return;
    }

    // const selectedFile = productImage;

    // // Validate image type and size
    // const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    // const maxSize = 300 * 1024;

    // if (!selectedFile || !allowedTypes.includes(selectedFile.type)) {
    //   alert("Please select a valid JPG, JPEG, or PNG image.");
    //   return;
    // }

    // if (selectedFile.size > maxSize) {
    //   alert("Image size exceeds the maximum allowed size (300 KB).");
    //   return;
    // }
    const hasEmptyOption = options.some(
      (item) => item.optionValue.trim() === ""
    );
    if (hasEmptyOption) {
      toast.warning("Please fill in all the option values");
      return;
    }

    if (slug === "") {
      toast.warning("Please fill slug");
      return;
    }

    try {
      setEditLoading(true);

      await axios
        .put(`${apiURL}/product/update-product/${id}`, {
          categoryType,
          basePrice,
          variant,
          brandName,
          seriesName,
          model,
          dynamicFields: JSON.stringify(options),
          bestSelling,
          estimatedPrice,
          slug,
        })
        .then((res) => {
          setEditLoading(false);
          toast.success("Product Edited Successfully");
        });
    } catch (err) {
      setEditLoading(false);
      toast.error(err.response.data.error);
    }
  };
  const handleOptionValueChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].optionValue = value;
    setOptions(newOptions);
  };

  const updateImage = async () => {
    if (!productImage) {
      toast.warning("Please select an image");
      return;
    }

    const selectedFile = productImage;

    // Validate image type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 300 * 1024;

    if (!selectedFile || !allowedTypes.includes(selectedFile.type)) {
      toast.warning("Please select a valid JPG, JPEG, or PNG image.");
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.warning("Image size exceeds the maximum allowed size (300 KB).");
      return;
    }

    try {
      setImageLoading(true);

      const formData = new FormData();
      formData.append("productImage", productImage);

      await axios.put(
        `${apiURL}/product/update-product-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageLoading(false);
      toast.success("Product Image Updated Successfully");
      fileInputRef.current.value = null;
      setProductImageURL("");
      getProductData();
    } catch (err) {
      setImageLoading(false);
      toast.error(err.response.data.error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="edit-product-container">
          {Loading ? (
            <Loader />
          ) : (
            <div className="category-edit-form-container">
              <div className="category-form-container">
                <h1>
                  <ArrowBackIcon
                    className="icons"
                    onClick={() => {
                      handleClose();
                    }}
                  />
                  Edit Product
                </h1>
                <FormControl fullWidth sx={{ mt: 2, width: 200 }} size="small">
                  <TextField
                    type="text"
                    label="Category"
                    value={categoryType}
                    disabled
                    size="small"
                    sx={{ ml: 2, width: 200 }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ mt: 2, ml: 2, width: 200 }}
                  size="small"
                >
                  <TextField
                    type="text"
                    label="Brand"
                    value={brandName}
                    disabled
                    size="small"
                    sx={{ ml: 2, width: 200 }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ mt: 2, ml: 2, width: 200 }}
                  size="small"
                >
                  <TextField
                    type="text"
                    label="Series"
                    value={seriesName}
                    disabled
                    size="small"
                    sx={{ ml: 2, width: 200 }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ mt: 2, ml: 2, width: 200 }}
                  size="small"
                >
                  <TextField
                    type="text"
                    label="Model"
                    value={model}
                    disabled
                    size="small"
                    sx={{ ml: 2, width: 200 }}
                  />
                </FormControl>
                <TextField
                  sx={{ mt: 2, ml: 4 }}
                  size="small"
                  label="Variant"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                />
                <br />
                <br />

                <TextField
                  type="number"
                  label="Base Price"
                  value={basePrice}
                  size="small"
                  sx={{ ml: 2, width: 200 }}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                <TextField
                  type="number"
                  label="Estimated Price"
                  value={estimatedPrice}
                  size="small"
                  sx={{ ml: 2, width: 200 }}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                />
                <FormControl
                  fullWidth
                  sx={{ mt: 0, ml: 2, width: 200 }}
                  size="small"
                >
                  <InputLabel id="best-selling-label">Best Selling</InputLabel>
                  <Select
                    labelId="best-selling-label"
                    id="best-selling"
                    value={bestSelling}
                    label="Best Selling"
                    onChange={handleBestSellingChange}
                  >
                    <MenuItem value="true">true</MenuItem>
                    <MenuItem value="false">false</MenuItem>
                  </Select>
                </FormControl>

                <img
                  src={imageUrl}
                  alt="Product"
                  style={{ maxWidth: "100%", maxHeight: "100px" }}
                />

                <TextField
                  id="outlined-search"
                  type="file"
                  size="small"
                  sx={{ mt: 2, ml: 2, width: 300, mr: 2 }}
                  onChange={handleImageChange}
                  inputRef={fileInputRef}
                />

                {productImageURL && (
                  <img
                    src={productImageURL}
                    alt="Product"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                )}

                {productImageURL && (
                  <Button
                    disabled={imageLoading}
                    onClick={updateImage}
                    variant="outlined"
                    sx={{
                      mt: 2,
                      backgroundColor: "#5644c4",
                      color: "white",
                      padding: 1,
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#5644c4",
                      },
                    }}
                  >
                    {imageLoading ? "Saving..." : "Save Image"}
                  </Button>
                )}

                <br />
                <TextField
                  type="text"
                  label="Slug"
                  value={slug}
                  size="small"
                  sx={{ mt: 0, width: 400, mb: 2, ml: 2 }}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\s+/g, "-"); // Replace spaces with dashes
                    value = value.replace(/\//g, "-"); // Replace slashes with dashes
                    setSlug(value);
                  }}
                />
                <br />
                {categoryType && (
                  <div className="add-product-options-container">
                    {options.map((item, index) => (
                      <div className="single-option-container" key={index}>
                        <TextField
                          size="small"
                          label={item.optionHeading}
                          type="text"
                          placeholder="value"
                          value={item.optionValue}
                          onChange={(e) =>
                            handleOptionValueChange(index, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                <br />
                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    backgroundColor: "#36383a",
                    color: "white",
                    padding: 1,
                    "&:hover": {
                      backgroundColor: "white",
                    },
                    width: "100%",
                  }}
                  onClick={submit}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving" : "Save Product"}
                </Button>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default EditProduct;
