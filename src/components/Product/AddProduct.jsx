import React, { useState, useRef } from "react";
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
import Nav from "../Repeatable/Nav";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [productImage, setProductImage] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [variant, setVariant] = useState("");
  const [modelData, setModelData] = useState([]);
  const [model, setModel] = useState("");
  const [options, setOptions] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [bestSelling, setBestSelling] = useState("false");
  const [slug, setSlug] = useState("");
  const fileInputRef = useRef(null);

  const handleBestSellingChange = (event) => {
    setBestSelling(event.target.value);
  };
  const handleCategoryChange = async (event) => {
    setCategoryType(event.target.value);
    setBrandName("");
    setSeriesName("");
    setModel("");
  };
  const handleBrandChange = async (event) => {
    setBrandName(event.target.value);
    setSeriesName("");
    setModel("");
  };

  const handleSeriesChange = async (event) => {
    setSeriesName(event.target.value);
    setModel("");
  };

  const handleModelChange = async (event) => {
    setModel(event.target.value);
  };
  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };
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

  useEffect(() => {
    axios
      .get(`${apiURL}/api/brand/brands-category/${categoryType}`)
      .then((response) => {
        console.log(response.data);
        setBrandData(response.data);
      })
      .catch((error) => {
        setBrandData([]);
        console.log(error.response.data.error);
      });
  }, [categoryType]);

  useEffect(() => {
    axios
      .get(`${apiURL}/api/brand/series/${brandName}/${categoryType}`)
      .then((response) => {
        console.log(response.data);
        setSeriesData(response.data);
      })
      .catch((error) => {
        setSeriesData([]);
        console.log(error.response.data.error);
      });
  }, [categoryType, brandName]);
  useEffect(() => {
    axios
      .get(
        `${apiURL}/api/brand/models/${categoryType}/${brandName}/${seriesName}`
      )
      .then((response) => {
        console.log(response.data);
        setModelData(response.data);
      })
      .catch((error) => {
        setModelData([]);
        console.log(error.response.data.error);
      });
  }, [categoryType, brandName, seriesName]);
  useEffect(() => {
    axios
      .get(`${apiURL}/api/category/fetch-category-name/${categoryType}`)
      .then((response) => {
        console.log(response.data);
        const category = response.data;
        let dummyData = [];
        category.sections.forEach((section) => {
          section.options.forEach((option) => {
            dummyData.push({
              optionType: option.type,
              optionHeading: option.description,
              optionValue: "",
            });
          });
        });
        // if (category.attributes) {
        //   category.attributes.forEach((attribute) => {
        //     attribute.options.forEach((option) => {
        //       dummyData.push({
        //         optionHeading: option.optionHeading,
        //         optionValue: "",
        //       });
        //     });
        //   });
        // }

        // // Extract sections
        // if (category.sections) {
        //   category.sections.forEach((section) => {
        //     section.options.forEach((option) => {
        //       dummyData.push({
        //         optionHeading: option.optionHeading,
        //         optionValue: "",
        //       });
        //     });
        //   });
        // }
        console.log(dummyData);
        setOptions(dummyData);
      })
      .catch((error) => {
        setOptions([]);
        console.log(error.response.data.error);
      });
  }, [categoryType]);

  const submit = async () => {
    if (
      categoryType === "" ||
      brandName === "" ||
      seriesName === "" ||
      model === "" ||
      variant === ""
    ) {
      toast.warning(
        "Please select the category , brand,series,model and variant"
      );
      return;
    }

    if (estimatedPrice === "" || basePrice === "") {
      toast.warning("Please enter price");
      return;
    }

    if (!productImage) {
      toast.warning("Please upload a image");
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

    const hasEmptyOption = options.some(
      (item) => item.optionValue.trim() === ""
    );
    if (slug === "") {
      toast.warning("Please fill slug");
      return;
    }
    if (hasEmptyOption) {
      toast.warning("Please fill in all the option values");
      return;
    }

    // If all checks pass, you can proceed with submitting the form
    try {
      setAddLoading(true);
      const formData = new FormData();
      formData.append("productImage", productImage);
      formData.append("basePrice", basePrice);
      formData.append("estimatedPrice", estimatedPrice);
      formData.append("variant", variant);
      formData.append("brandName", brandName);
      formData.append("seriesName", seriesName);
      formData.append("model", model);
      formData.append("categoryType", categoryType);
      formData.append("bestSelling", bestSelling);
      formData.append("slug", slug);

      // Append dynamicFields as JSON string (adjust based on your server expectations)
      formData.append("dynamicFields", JSON.stringify(options));
      await axios
        .post(`${apiURL}/product/create-productss`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          fileInputRef.current.value = null;
          setAddLoading(false);
          setEstimatedPrice("");
          toast.success("Product Created Successfully");
          setProductImage(null);
          setBasePrice("");
          setVariant("");
          setBrandName("");
          setSeriesName("");
          setModel("");
          setCategoryType("");
          setOptions([]);
          setBestSelling("false");
          setSlug("");
        });
    } catch (err) {
      fileInputRef.current.value = null;
      setProductImage(null);
      setAddLoading(false);
      toast.warning(err.response.data.error);
      console.log(err);
    }
  };

  const handleOptionValueChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].optionValue = value;
    setOptions(newOptions);
  };

  return (
    <div>
      <Nav />
      <div className="main-container">
        <div>
          <h1>
            <ArrowBackIcon
              className="icons"
              onClick={() => {
                navigate("/view-product");
              }}
            />
            Create Product
          </h1>
          <div className="add-product-main-container">
            <FormControl fullWidth sx={{ mt: 2, width: 200 }} size="small">
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryType}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categoryData.map((item) => (
                  <MenuItem value={item.category_type}>
                    {item.category_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={{ mt: 2, ml: 2, width: 200 }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">Brand</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={brandName}
                label="Category"
                onChange={handleBrandChange}
              >
                {brandData.map((item) => (
                  <MenuItem value={item.brandName}>{item.brandName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={{ mt: 2, ml: 2, width: 200 }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label"> Series</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={seriesName}
                label="Category"
                onChange={handleSeriesChange}
              >
                {seriesData.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={{ mt: 2, ml: 2, width: 200 }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">Model</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={model}
                label="Category"
                onChange={handleModelChange}
              >
                {modelData.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              sx={{ mt: 2, ml: 2 }}
              size="small"
              label="Variant"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            />

            <TextField
              type="number"
              label="Base Price"
              value={basePrice}
              size="small"
              sx={{ mt: 2, width: 200 }}
              onChange={(e) => setBasePrice(e.target.value)}
            />

            <TextField
              type="number"
              label="Estimated Price"
              value={estimatedPrice}
              size="small"
              sx={{ mt: 2, ml: 2, width: 200 }}
              onChange={(e) => setEstimatedPrice(e.target.value)}
            />

            <FormControl
              fullWidth
              sx={{ mt: 2, ml: 2, width: 200 }}
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
            <TextField
              id="outlined-search"
              type="file"
              size="small"
              sx={{ mt: 2, ml: 2, width: 300 }}
              onChange={handleImageChange}
              inputRef={fileInputRef}
            />

            <br />
            <TextField
              type="text"
              label="Slug"
              value={slug}
              size="small"
              sx={{ mt: 2, width: 400, mb: 2 }}
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
                      style={{
                        backgroundColor:
                          item.optionType === "add" ? "#99ff99" : "#FF7276",
                        color: "black",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <br />
            <Button
              disabled={addLoading}
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
            >
              {addLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddProduct;
