import "./App.css";
import Stats from "./components/Home/Stats";
import Nav from "./components/Repeatable/Nav";
import Form from "./components/Home/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCategory from "./components/Category/CreateCategory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import { useEffect } from "react";
import pako from "pako";
import { createTheme, ThemeProvider } from "@mui/material";
import Category from "./components/Category/Category";
import Login from "./components/Repeatable/Login";
import { useDispatch, useSelector } from "react-redux";
import AddBrand from "./components/Brand/AddBrand";
import ViewBrand from "./components/Brand/ViewBrand";
import EditBrand from "./components/Brand/EditBrand";
import Brand from "./components/Brand/Brand";
import Product from "./components/Product/Product";
import AddProduct from "./components/Product/AddProduct";
import BulkUpload from "./components/Product/BulkUpload";
import ViewPinCode from "./components/PinCodes/ViewPinCode";
import AddPinCode from "./components/PinCodes/AddPinCode";
import User from "./components/Users/User";
import Order from "./components/Order/Order";
import CancelOrder from "./components/Order/CancelOrder";
import CompleteOrder from "./components/Order/CompleteOrder";
import ViewPromoCode from "./components/Promo/ViewPromoCode";
import AddPromoCode from "./components/Promo/AddPromoCode";
import Abandoned from "./components/Abandoned/Abandoned";
import AddPartner from "./components/Partner/AddPartner";
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(54, 56, 58)", // Change this to your desired primary color
    },
    secondary: {
      main: "#fff", // Change this to your desired secondary color
    },
    // You can customize other colors like error, warning, info, and success as well
  },
});
function App() {
  const user = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />}></Route>
          <Route
            path="/create-category"
            element={user ? <CreateCategory /> : <Login />}
          ></Route>
          <Route
            path="/view-category"
            element={user ? <Category /> : <Login />}
          ></Route>
          <Route path="/login" element={!user ? <Login /> : <Home />}></Route>
          <Route
            path="/create-brand"
            element={user ? <AddBrand /> : <Login />}
          ></Route>
          <Route
            path="/view-brand"
            element={user ? <Brand /> : <Login />}
          ></Route>
          <Route
            path="edit-brand/:id"
            element={user ? <EditBrand /> : <Login />}
          ></Route>
          <Route
            path="/view-product"
            element={user ? <Product /> : <Login />}
          />
          <Route
            path="/create-product"
            element={user ? <AddProduct /> : <Login />}
          />
          <Route
            path="/bulk-upload"
            element={user ? <BulkUpload /> : <Login />}
          />
          <Route
            path="/view-pincode"
            element={user ? <ViewPinCode /> : <Login />}
          ></Route>
          <Route
            path="/add-pincode"
            element={user ? <AddPinCode /> : <Login />}
          ></Route>
          <Route path="/view-user" element={user ? <User /> : <Login />} />
          <Route path="/view-order" element={user ? <Order /> : <Login />} />
          <Route path="/cancel-order" element={<CompleteOrder />} />
          <Route
            path="/view-promo-code"
            element={user ? <ViewPromoCode /> : <Login />}
          />
          <Route
            path="/add-promo-code"
            element={user ? <AddPromoCode /> : <Login />}
          />
          <Route
            path="/view-abandoned-orders"
            element={user ? <Abandoned /> : <Login />}
          />
          <Route
            path="/add-partner"
            element={user ? <AddPartner /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
