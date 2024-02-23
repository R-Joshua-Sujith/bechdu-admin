import React from "react";
import "./Stats.css";
import Nav from "../Repeatable/Nav";
import { useState } from "react";
const Stats = () => {
  const [formFields, setFormFields] = useState([
    {
      sectionType: "yesNo",
      options: [{ optionDescription: "", optionType: "" }],
    },
  ]);

  const addSection = () => {
    setFormFields([...formFields, { sectionType: "", options: [] }]);
  };

  const addOption = (sectionIndex) => {
    const updatedFormFields = [...formFields];
    updatedFormFields[sectionIndex].options.push({
      optionDescription: "",
      optionType: "",
    });
    setFormFields(updatedFormFields);
  };

  const deleteSection = (sectionIndex) => {
    const updatedFormFields = [...formFields];
    updatedFormFields.splice(sectionIndex, 1);
    setFormFields(updatedFormFields);
  };

  const deleteOption = (sectionIndex, optionIndex) => {
    const updatedFormFields = [...formFields];
    updatedFormFields[sectionIndex].options.splice(optionIndex, 1);
    setFormFields(updatedFormFields);
  };
  return (
    <div>
      <label htmlFor="categoryName">Category Name:</label>
      <input type="text" id="categoryName" name="categoryName" />

      {formFields.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <label>Section Type:</label>
          <select
            value={section.sectionType}
            onChange={(e) => {
              const updatedFormFields = [...formFields];
              updatedFormFields[sectionIndex].sectionType = e.target.value;
              setFormFields(updatedFormFields);
            }}
          >
            <option value="yesNo">Yes/No</option>
            <option value="image">Image</option>
            <option value="grid">Grid</option>
          </select>

          {section.sectionType === "yesNo" && (
            <div>
              <label>Option Description:</label>
              <input type="text" />
              <label>Option Type:</label>
              <input type="text" />
            </div>
          )}

          {section.sectionType === "image" && (
            <div>
              <label>Option Description:</label>
              <input type="text" />
              <label>Input Type to Upload Image:</label>
              <input type="file" />
              <label>Option Type:</label>
              <input type="text" />
            </div>
          )}

          {section.sectionType === "grid" && (
            <div>
              <label>Option Description:</label>
              <input type="text" />
              <label>Option Type:</label>
              <input type="text" />
            </div>
          )}

          <button onClick={() => addOption(sectionIndex)}>Add Option</button>
          <button onClick={() => deleteSection(sectionIndex)}>
            Delete Section
          </button>

          {section.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <label>Option Description:</label>
              <input type="text" />
              <label>Option Type:</label>
              <input type="text" />
              <button onClick={() => deleteOption(sectionIndex, optionIndex)}>
                Delete Option
              </button>
            </div>
          ))}
        </div>
      ))}

      <button onClick={addSection}>Add Section</button>
    </div>
  );
};

export default Stats;

{
  /* <Nav />
<div className="main-container">
  <h1>Home Pagewerwerwewerwewr</h1>
</div> */
}
