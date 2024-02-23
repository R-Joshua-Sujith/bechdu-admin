import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Repeatable/Nav";
import ModalTemplate from "../Category/ModalTemplate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import "../Category/Custom.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ColumnToggleDropdown from "../Repeatable/ColumnToggleDropdown";
import { useDispatch, useSelector } from "react-redux";
import EditBrand from "../Brand/EditBrand";
import EditProduct from "./EditProduct";
import Button from "@mui/material/Button";

const Product = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const params = new URLSearchParams(window.location.search);
  const initialPage = parseInt(params.get("page"), 10) || 1;
  const initialSize = parseInt(params.get("pageSize"), 10) || 10;
  const navigate = useNavigate("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState("");

  const savedColumns = localStorage.getItem("product");

  const [visibleColumns, setVisibleColumns] = useState(
    savedColumns
      ? JSON.parse(savedColumns)
      : {
          categoryType: true,
          brandName: true,
          model: true,
          variant: true,
          basePrice: true,
          estimatedPrice: true,
          actions: true,
        }
  );

  const updateUrl = ({ page, pageSize }) => {
    const newUrl = `?page=${page}&pageSize=${pageSize}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    updateUrl({ page: 1, pageSize });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateUrl({ page: newPage, pageSize });
  };

  const handlePageSizeSelectChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to page 1 when changing page size
    updateUrl({ page: 1, pageSize: newPageSize });
  };

  const columns = [
    {
      field: "categoryType",
      headerName: "Category",
      visible: visibleColumns.categoryType,
    },
    {
      field: "brandName",
      headerName: "brand",
      visible: visibleColumns.brandName,
    },
    {
      field: "model",
      headerName: "Model",
      visible: visibleColumns.model,
    },
    {
      field: "variant",
      headerName: "Variant",
      visible: visibleColumns.variant,
    },
    {
      field: "basePrice",
      headerName: "Base Price",
      visible: visibleColumns.basePrice,
    },
    {
      field: "estimatedPrice",
      headerName: "Estimated Price",
      visible: visibleColumns.estimatedPrice,
    },
    {
      field: "actions",
      headerName: "Actions",
      visible: visibleColumns.actions,
    },
  ];
  const getCategoryData = async () => {
    await axios
      .get(
        `${apiURL}/product/get-all-products?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
      ) // replace with your actual API endpoint
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
        setTotalRows(response.data.totalRows);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  useEffect(() => {
    // Read pagination data from URL on component mount
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page"), 10) || 1;
    const size = parseInt(params.get("pageSize"), 10) || 10;

    setCurrentPage(page);
    setPageSize(size);
  }, []);

  useEffect(() => {
    getCategoryData();
    console.log(columns);
  }, [currentPage, pageSize, searchQuery]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCategoryID(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryID(null);
    setCategory(null);
  };

  const confirmDeleteCategory = async () => {
    await confirmDelete();
    setCategory(null);
    setCategoryID(null);
    closeDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      await axios
        .delete(`${apiURL}/product/delete-product/${categoryID}`)
        .then((res) => {
          toast.info(res.data.message);
          getCategoryData();
        });
    } catch (error) {
      console.log(error);
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
    }
  };
  return (
    <div className={isEditModalOpen ? "disabled-div" : ""}>
      <Nav />
      <div className="main-container">
        <div>
          <div className="heading-column-toggle-container">
            <h1>Product</h1>
            <ColumnToggleDropdown
              tableName="product"
              columns={columns}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </div>
          <div className="header-container">
            {" "}
            <div className="search-container">
              <SearchIcon />{" "}
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  navigate("/bulk-upload");
                }}
              >
                Bulk Actions
              </button>
              <button
                onClick={() => {
                  navigate("/create-product");
                }}
              >
                Create New Entry
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="responsive-table">
            <thead>
              {columns
                .filter((column) => column.visible)
                .map((column) => (
                  <th key={column.field}>{column.headerName}</th>
                ))}
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row._id}>
                  {columns
                    .filter((column) => column.visible)
                    .map((column) => (
                      <td key={column.field}>
                        {column.field === "actions" ? (
                          // Render actions column content
                          <div className="action-container">
                            <MoreVertIcon
                              className="icons"
                              onClick={() => {
                                if (selectedRow === row._id) {
                                  setSelectedRow("");
                                } else {
                                  setSelectedRow(row._id);
                                }
                              }}
                            />
                            {selectedRow === row._id && !isEditModalOpen && (
                              <div className="sub-action-container">
                                <div
                                  className="action-icon-container"
                                  onClick={() => {
                                    setCategoryID(row._id);
                                    openEditModal();
                                  }}
                                >
                                  <EditIcon />
                                  <div>Edit</div>
                                </div>
                                <div
                                  className="action-icon-container"
                                  onClick={() => {
                                    setSelectedRow("");
                                    setCategory(`${row.model} ${row.variant}`);
                                    setCategoryID(row._id);
                                    openDeleteModal();
                                  }}
                                >
                                  <DeleteIcon />
                                  <div>Delete</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Render other columns content
                          row[column.field]
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="select-container">
          <div>
            <select value={pageSize} onChange={handlePageSizeSelectChange}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>Total Items : {totalRows}</div>
        </div>

        <Pagination
          count={Math.ceil(totalRows / pageSize)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            display: "block",
            width: "100%",
            height: "max-content",
            marginTop: "10px",
            backgroundColor: "transparent",
          }}
        />
      </div>
      <EditProduct
        id={categoryID}
        isOpen={isEditModalOpen}
        handleClose={closeEditModal}
      />
      {/* <EditCategory
        id={categoryID}
        isOpen={isEditModalOpen}
        handleClose={closeEditModal}
      /> */}
      <ModalTemplate
        isOpen={isDeleteModalOpen}
        handleClose={closeDeleteModal}
        handleDelete={confirmDeleteCategory}
        description={category}
      />
      <ToastContainer />
    </div>
  );
};

export default Product;
