import React from "react";
import Modal from "react-modal";

const ModalTemplate = ({ isOpen, handleClose, handleDelete, description }) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0,0.5)",
    },
    content: {
      height: "150px",
      maxWidth: "max-content",
      margin: "auto",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    header: {
      fontSize: "20px",
      marginBottom: "30px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "20px",
    },
    button: {
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      border: "none",
      marginRight: "10px",
      fontWeight: "bold",
    },
    confirmButton: {
      backgroundColor: "#FF0000",
      color: "#FFF",
    },
    cancelButton: {
      backgroundColor: "#EEE",
      color: "#333",
    },
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Delete Confirmation Modal"
      style={{
        overlay: customStyles.overlay,
        content: customStyles.content,
      }}
    >
      <h2 style={customStyles.header}>
        Are you sure want to delete {description} ?
      </h2>
      <div style={customStyles.buttonContainer}>
        <button
          style={{ ...customStyles.button, ...customStyles.confirmButton }}
          onClick={handleDelete}
        >
          Yes
        </button>
        <button
          style={{ ...customStyles.button, ...customStyles.cancelButton }}
          onClick={handleClose}
        >
          No
        </button>
      </div>
    </Modal>
  );
};

export default ModalTemplate;
