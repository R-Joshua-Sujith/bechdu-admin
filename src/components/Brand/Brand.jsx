import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../Repeatable/Nav";
import ModalTemplate from "../Category/ModalTemplate";
import EditCategory from "../Category/EditCategory";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../Category/Custom.css";
import ColumnToggleDropdown from "../Repeatable/ColumnToggleDropdown";
import { useDispatch, useSelector } from "react-redux";
import EditBrand from "./EditBrand";

const Brand = () => {
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

  const savedColumns = localStorage.getItem("brand");

  const [visibleColumns, setVisibleColumns] = useState(
    savedColumns
      ? JSON.parse(savedColumns)
      : {
          brandName: true,
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
      field: "brandName",
      headerName: "Brand",
      visible: visibleColumns.brandName,
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
        `${apiURL}/api/brand/get-all-brands?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
      ) // replace with your actual API endpoint
      .then((response) => {
        console.log;
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
        .delete(`${apiURL}/api/brand/delete-brand/${categoryID}`)
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
            <h1>Brands</h1>
            <ColumnToggleDropdown
              tableName="brand"
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
            <button
              onClick={() => {
                navigate("/create-brand");
              }}
            >
              Create New Entry
            </button>
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
                                    setCategory(row.brandName);
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
      <EditBrand
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

export default Brand;
