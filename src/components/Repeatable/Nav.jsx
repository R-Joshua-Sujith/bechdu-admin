import React from "react";
import "./Nav.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
const Nav = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  const navigate = useNavigate();
  return (
    <nav>
      <div
        className="b-nav-heading"
        onClick={() => {
          navigate("/");
        }}
      ></div>
      <div className="b-nav-items-container">
        <div
          className={
            isActive("/view-category") || isActive("/create-category")
              ? "b-nav-items active"
              : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-category");
          }}
        >
          Categories
        </div>
        <div
          className={
            isActive("/view-brand") || isActive("/create-brand")
              ? "b-nav-items active"
              : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-brand");
          }}
        >
          Brands
        </div>
        <div
          className={
            isActive("/view-product") || isActive("/create-product")
              ? "b-nav-items active"
              : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-product");
          }}
        >
          Products
        </div>
        <div
          className={
            isActive("/view-order") ? "b-nav-items active" : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-order");
          }}
        >
          Orders
        </div>
        <div
          className={
            isActive("/view-user") ? "b-nav-items active" : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-user");
          }}
        >
          Users
        </div>
        <div
          className={
            isActive("/view-pincode") ? "b-nav-items active" : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-pincode");
          }}
        >
          PinCodes
        </div>
        <div
          className={
            isActive("/view-promo-code") || isActive("/add-promo-code")
              ? "b-nav-items active"
              : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-promo-code");
          }}
        >
          Promo Code
        </div>
        <div
          className={
            isActive("/view-abandoned-orders")
              ? "b-nav-items active"
              : "b-nav-items"
          }
          onClick={() => {
            navigate("/view-abandoned-orders");
          }}
        >
          Abandoned Orders
        </div>
        <div
          className={
            isActive("/add-partner") ? "b-nav-items active" : "b-nav-items"
          }
          onClick={() => {
            navigate("/add-partner");
          }}
        >
          Partners
        </div>
        <div className="b-nav-items">Contact Form</div>

        <div
          className="b-nav-items"
          onClick={() => {
            dispatch({ type: "logout" });
            localStorage.clear();
          }}
        >
          Log Out
        </div>
      </div>
    </nav>
  );
};

export default Nav;
