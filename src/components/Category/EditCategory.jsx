import React, { useEffect, useState } from "react";
import "./EditCategory.css";
import Nav from "../Repeatable/Nav";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Section from "./Section";
import Loader from "../Repeatable/Loader";
import pako from "pako";
import { useDispatch, useSelector } from "react-redux";
const EditCategory = ({ id, handleClose, isOpen }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [Loading, setLoading] = useState(false);
  const getCategoryData = async () => {
    setLoading(true);
    await axios
      .get(`${apiURL}/api/category/fetch-category-id/${id}`)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setSelectedCategory(res.data.category_type);
        setSlug(res.data.slug);
        setSections(res.data.sections);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.response.data.error);
      });
  };
  useEffect(() => {
    if (id) {
      getCategoryData();
    }
  }, [id]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      { heading: "", description: "", type: "", options: [], criteria: "none" },
    ]);
  };

  const moveSection = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);
    setSections(updatedSections);
  };

  const handleSectionCriteriaChange = (index, criteria) => {
    const updatedSections = [...sections];
    updatedSections[index].criteria = criteria;
    setSections(updatedSections);
  };

  const handleSectionTypeChange = (index, type) => {
    const updatedSections = [...sections];
    updatedSections[index].type = type;
    setSections(updatedSections);
  };

  const handleSectionHeadingChange = (index, heading) => {
    const updatedSections = [...sections];
    updatedSections[index].heading = heading;
    setSections(updatedSections);
  };

  const handleSectionDescriptionChange = (index, description) => {
    const updatedSections = [...sections];
    updatedSections[index].description = description;
    setSections(updatedSections);
  };

  const handleDeleteSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleAddOption = (sectionIndex, sectionType) => {
    if (sectionType === "") {
      toast.warning("Please select a section type before adding options");
      return;
    }
    const updatedSections = [...sections];
    const option = { description: "", type: "add", image: "" };
    updatedSections[sectionIndex].options.push(option);
    setSections(updatedSections);
  };

  const handleDeleteOption = (sectionIndex, optionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].options.splice(optionIndex, 1);
    setSections(updatedSections);
  };

  const handleOptionChange = (sectionIndex, optionIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].options[optionIndex][field] = value;
    setSections(updatedSections);
  };

  const handleImageChange = (sectionIndex, optionIndex, e) => {
    const updatedSections = [...sections];
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.warning("Please upload a valid image file (jpg, jpeg, or png).");
      return;
    }

    // Check file size (max size: 10KB)
    const maxSize = 10 * 1024; // 10KB in bytes
    if (file.size > maxSize) {
      toast.warning("Image size must not exceed 10KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updatedSections[sectionIndex].options[optionIndex].image = reader.result;
      setSections(updatedSections);
    };

    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (selectedCategory === "") {
      toast.warning("Please fill category name");
      return;
    }
    if (slug === "") {
      toast.warning("Please fill slug");
      return;
    }
    if (sections.length === 0) {
      toast.warning("Please add at least one section");
      return;
    }

    // Validation for empty section headings
    const hasEmptySectionHeading = sections.some(
      (section) => section.heading.trim() === ""
    );

    if (hasEmptySectionHeading) {
      toast.warning("Please fill in the section heading for all sections.");
      return; // Stop further execution
    }

    // Validation for empty section headings
    const hasEmptySectionDescription = sections.some(
      (section) => section.description.trim() === ""
    );

    if (hasEmptySectionDescription) {
      toast.warning("Please fill in the section description for all sections.");
      return; // Stop further execution
    }

    // Validation for option descriptions
    const hasEmptyOptionDescription = sections.some((section) =>
      section.options.some((option) => option.description.trim() === "")
    );

    if (hasEmptyOptionDescription) {
      toast.warning("Please fill in the option description for all sections.");
      return; // Stop further execution
    }

    // Validation for image upload in sections with type "image"
    const hasMissingImage = sections.some(
      (section) =>
        section.type === "image" &&
        section.options.some((option) => !option.image)
    );

    if (hasMissingImage) {
      toast.warning("Please upload an image for sections with type 'image'.");
      return; // Stop further execution
    }

    const hasSectionsWithZeroOptions = sections.some(
      (section) => section.options.length === 0
    );

    if (hasSectionsWithZeroOptions) {
      toast.warning("Each section must have at least one option.");
      return; // Stop further execution
    }

    setCreateLoading(true);
    // If all validations pass, log the sections
    await axios
      .put(
        `${apiURL}/api/category/edit-category/${id}`,

        {
          category_type: selectedCategory,
          slug,
          sections: sections,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        setCreateLoading(false);
      })
      .catch((error) => {
        setCreateLoading(false);
        if (error.response.status === 401) {
          toast.error("Session Expired");
          setTimeout(() => {
            dispatch({ type: "logout" });
          }, 2000);
        } else if (error.response.status === 400) {
          toast.error("Bad Request you are not authenticated");
        } else {
          toast.error(error.response.data.error);
        }
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {isOpen && (
        <div className="category-edit-form-container">
          {Loading ? (
            <Loader />
          ) : (
            <div className="category-form-container">
              <h1>
                <ArrowBackIcon
                  className="icons"
                  onClick={() => {
                    handleClose();
                  }}
                />
                Edit Category
              </h1>
              <label>
                Category Name:
                <input
                  type="text"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  placeholder="Enter Category Name"
                />
              </label>
              <label>
                Slug
                <input
                  type="text"
                  value={slug}
                  onChange={(event) => {
                    const newSlug = event.target.value.replace(/\s+/g, "-");
                    setSlug(newSlug);
                  }}
                  placeholder="Enter Category Name"
                />
              </label>
              <br />
              <button onClick={handleAddSection}>Add Section</button>
              <br />
              {sections.map((section, index) => (
                <Section
                  key={index}
                  section={section}
                  index={index}
                  moveSection={moveSection}
                  handleSectionHeadingChange={handleSectionHeadingChange}
                  handleSectionDescriptionChange={
                    handleSectionDescriptionChange
                  }
                  handleSectionTypeChange={handleSectionTypeChange}
                  handleSectionCriteriaChange={handleSectionCriteriaChange}
                  handleDeleteSection={handleDeleteSection}
                  handleAddOption={handleAddOption}
                  handleOptionChange={handleOptionChange}
                  handleImageChange={handleImageChange}
                  handleDeleteOption={handleDeleteOption}
                />
              ))}
              <button
                onClick={handleCreate}
                className="category-create-button"
                disabled={createLoading}
              >
                {createLoading ? "Saving Changes" : "Save Category"}
              </button>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </DndProvider>
  );
};

export default EditCategory;
