import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const Section = ({
  section,
  index,
  moveSection,
  handleSectionHeadingChange,
  handleSectionTypeChange,
  handleSectionCriteriaChange,
  handleDeleteSection,
  handleAddOption,
  handleOptionChange,
  handleImageChange,
  handleDeleteOption,
}) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [, ref] = useDrag({
    type: "SECTION",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="section-container">
      <label>
        Section Heading:
        <input
          type="text"
          value={section.heading}
          onChange={(e) => handleSectionHeadingChange(index, e.target.value)}
          placeholder="Enter Section Heading"
        />
      </label>
      <label>
        Section Type:
        <select
          value={section.type}
          onChange={(e) => handleSectionTypeChange(index, e.target.value)}
        >
          <option value="">Select Section Type</option>
          <option value="yes/no">yes/no</option>
          <option value="grid">grid</option>
          <option value="image">image</option>
        </select>
      </label>
      <label>
        Section Criteria:
        <select
          value={section.sectionCriteria}
          onChange={(e) => handleSectionCriteriaChange(index, e.target.value)}
        >
          <option value="all">all</option>
          <option value="one">one</option>
          <option value="some">some</option>
          <option value="none">none</option>
        </select>
      </label>

      <button onClick={() => handleDeleteSection(index)}>Delete Section</button>
      <br />
      {section.type && (
        <div>
          <button onClick={() => handleAddOption(index)}>Add Option</button>
          {section.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option-container">
              <label>
                Option Description:
                <input
                  type="text"
                  value={option.description}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      optionIndex,
                      "description",
                      e.target.value
                    )
                  }
                />
              </label>
              <label>
                Option Type:
                <select
                  value={option.type}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      optionIndex,
                      "type",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Option Type</option>
                  <option value="add">add</option>
                  <option value="sub">s9ubtract</option>
                </select>
              </label>
              {section.type === "image" && (
                <label>
                  Image:
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(index, optionIndex, e)}
                  />
                  {option.image && (
                    <img src={option.image} alt="Preview" width="50" />
                  )}
                </label>
              )}
              <button onClick={() => handleDeleteOption(index, optionIndex)}>
                Delete Option
              </button>
              <br />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Form = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sections, setSections] = useState([
    {
      heading: "",
      type: "yes/no",
      options: [{ description: "", type: "add", image: "" }],
      criteria: "none",
    },
    {
      heading: "",
      type: "image",
      options: [{ description: "", type: "add", image: "" }],
      criteria: "none",
    },
    {
      heading: "",
      type: "grid",
      options: [{ description: "", type: "add", image: "" }],
      criteria: "none",
    },
  ]);
  const [imageFiles, setImageFiles] = useState([]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      { heading: "", type: "", options: [], sectionCriteria: "none" },
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

  const handleDeleteSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleAddOption = (sectionIndex) => {
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

    // Validation for empty section headings
    const hasEmptySectionHeading = sections.some(
      (section) => section.heading.trim() === ""
    );

    if (hasEmptySectionHeading) {
      toast.warning("Please fill in the section heading for all sections.");
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
    console.log(selectedCategory, sections);
    // If all validations pass, log the sections
    await axios
      .post(`${apiURL}/api/category/create`, {
        name: selectedCategory,
        sections: sections,
      })
      .then((response) => {
        toast.success("Category Created Successfully");
      })
      .catch((error) => {
        toast.error("Server Error");
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="category-form-container">
        <label>
          Category Name:
          <input
            type="text"
            value={selectedCategory}
            onChange={handleCategoryChange}
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
            handleSectionTypeChange={handleSectionTypeChange}
            handleSectionCriteriaChange={handleSectionCriteriaChange}
            handleDeleteSection={handleDeleteSection}
            handleAddOption={handleAddOption}
            handleOptionChange={handleOptionChange}
            handleImageChange={handleImageChange}
            handleDeleteOption={handleDeleteOption}
          />
        ))}
        <button onClick={handleCreate} className="category-create-button">
          Create
        </button>
      </div>
    </DndProvider>
  );
};

export default Form;
