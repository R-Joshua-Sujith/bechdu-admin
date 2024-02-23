import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import ModalTemplate from "./ModalTemplate";
import Modal from "react-modal";
import "./Section.css";
const Section = ({
  section,
  index,
  moveSection,
  handleSectionHeadingChange,
  handleSectionDescriptionChange,
  handleSectionTypeChange,
  handleSectionCriteriaChange,
  handleDeleteSection,
  handleAddOption,
  handleOptionChange,
  handleImageChange,
  handleDeleteOption,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSectionIndex, setDeletingSectionIndex] = useState(null);
  const [deletingSectionHeading, setDeletingSectionHeading] = useState(null);

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

  const openDeleteModal = (index) => {
    setDeletingSectionIndex(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingSectionHeading(null);
    setIsDeleteModalOpen(false);
    setDeletingSectionIndex(null);
  };

  const confirmDeleteSection = async () => {
    await handleDeleteSection(index);
    setDeletingSectionIndex(null);
    setDeletingSectionHeading(null);
    closeDeleteModal();
  };

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

      <div className="arrow-up-down-container">
        {!showOptions && (
          <ArrowDownwardIcon
            className="icons"
            onClick={() => {
              setShowOptions(true);
            }}
          />
        )}
        {showOptions && (
          <ArrowUpwardIcon
            className="icons"
            onClick={() => setShowOptions(false)}
          />
        )}
        <DeleteIcon
          className="icons"
          onClick={() => {
            setDeletingSectionHeading(section.heading);
            openDeleteModal(index);
          }}
        />
      </div>

      <br />
      {showOptions && (
        <div className="section-sub-container">
          <label>
            Section Description
            <input
              type="text"
              value={section.description}
              onChange={(e) =>
                handleSectionDescriptionChange(index, e.target.value)
              }
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
              value={section.criteria}
              onChange={(e) =>
                handleSectionCriteriaChange(index, e.target.value)
              }
            >
              <option value="all">all</option>
              <option value="one">one</option>
              <option value="some">some</option>
              <option value="none">none</option>
            </select>
          </label>
          <br />
          <button onClick={() => handleAddOption(index, section.type)}>
            Add Option
          </button>

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
                  <option value="sub">sub</option>
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
      <ModalTemplate
        isOpen={isDeleteModalOpen}
        handleClose={closeDeleteModal}
        handleDelete={confirmDeleteSection}
        description={deletingSectionHeading}
      />
    </div>
  );
};

export default Section;
