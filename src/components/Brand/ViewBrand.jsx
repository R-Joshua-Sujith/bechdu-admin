import React from "react";
import "./ViewBrand.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteConfirmationModal = ({ isOpen, handleClose, handleDelete }) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Are you sure you want to delete?
        </Typography>
        <Button onClick={handleDelete} variant="contained" sx={{ mr: 2 }}>
          Yes
        </Button>
        <Button onClick={handleClose} variant="contained">
          No
        </Button>
      </Box>
    </Modal>
  );
};

const ViewBrand = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate("");
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    brandId: null,
  });
  const columns = [
    {
      field: "brandName",
      headerName: "Brand",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="icon-container">
          <VisibilityIcon
            onClick={() => {
              navigate(`/view-brand/${params.row._id}`);
            }}
          />
          <EditIcon
            onClick={() => {
              navigate(`/edit-brand/${params.row._id}`);
            }}
          />
          <DeleteIcon
            onClick={() => {
              deleteBrand(params.row._id);
            }}
          />
        </div>
      ),
    },
  ];
  const getProduct = async () => {
    await axios
      .get(`${apiURL}/api/brand/brands`) // replace with your actual API endpoint
      .then((response) => {
        // Set the data
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    getProduct();
  }, []);

  const deleteBrand = (id) => {
    setDeleteConfirmation({ isOpen: true, brandId: id });
  };

  const confirmDelete = async () => {
    try {
      const id = deleteConfirmation.brandId;
      await axios
        .delete(`${apiURL}/api/brand/delete-brand/${id}`)
        .then((res) => {
          getProduct();
          toast.info(res.data.message);
        });
    } catch (err) {
      toast.info(err.response.data.error);
    } finally {
      setDeleteConfirmation({ isOpen: false, brandId: null });
    }
  };

  return (
    <div className="view-brand-container">
      <div>
        <div>
          <h1>Brand</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate("/add-brand");
            }}
            sx={{
              backgroundColor: "#5644c4",
              padding: 2,
              "&:hover": {
                backgroundColor: "white",
                color: "#5644c4",
              },
            }}
          >
            Create new entry
          </Button>
        </div>
        <Box sx={{ height: 400, width: "100%", mt: 3 }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
          />
        </Box>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        handleClose={() =>
          setDeleteConfirmation({ isOpen: false, brandId: null })
        }
        handleDelete={confirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ViewBrand;
