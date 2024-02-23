import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Repeatable/Nav";
import ColumnToggleDropdown from "../Repeatable/ColumnToggleDropdown";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import EditUser from "./EditUser";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const User = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const params = new URLSearchParams(window.location.search);
  const initialPage = parseInt(params.get("page"), 10) || 1;
  const initialSize = parseInt(params.get("pageSize"), 10) || 10;
  const navigate = useNavigate("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const savedColumns = localStorage.getItem("user");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(
    savedColumns
      ? JSON.parse(savedColumns)
      : {
          phone: true,
          name: true,
          email: true,
          addPhone: true,
          city: true,
          pincode: true,
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
      field: "phone",
      headerName: "Phone",
      visible: visibleColumns.phone,
    },
    {
      field: "name",
      headerName: "Name",
      visible: visibleColumns.name,
    },
    {
      field: "email",
      headerName: "Email",
      visible: visibleColumns.email,
    },
    {
      field: "addPhone",
      headerName: "Add Phone",
      visible: visibleColumns.addPhone,
    },
    {
      field: "city",
      headerName: "City",
      visible: visibleColumns.city,
    },
    {
      field: "pincode",
      headerName: "pincode",
      visible: visibleColumns.pincode,
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
        `${apiURL}/user/get-all-users?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
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
  }, [currentPage, pageSize, searchQuery]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCategoryID(null);
  };
  return (
    <div>
      <Nav />
      <div className="main-container">
        <div>
          <div className="heading-column-toggle-container">
            <h1>Users</h1>
            <ColumnToggleDropdown
              tableName="user"
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
            {/* <button
              onClick={() => {
                navigate("/create-brand");
              }}
            >
              Create New Entry
            </button> */}
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
                            <RemoveRedEyeIcon
                              className="action-icon-container"
                              onClick={() => {
                                setCategoryID(row._id);
                                openEditModal();
                              }}
                            />
                          </div>
                        ) : (
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
      <EditUser
        id={categoryID}
        isOpen={isEditModalOpen}
        handleClose={closeEditModal}
      />
    </div>
  );
};

export default User;
