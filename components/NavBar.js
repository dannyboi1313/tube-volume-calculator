import React, { useState, useRef, useEffect } from "react";
import SimpleButton from "./SimpleButton";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ hamburgerFunction }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [updateEffect, setUpdateEffect] = useState(false);
  const handleMenuToggle = () => {
    setNavbarOpen((prev) => !prev);
    hamburgerFunction(navbarOpen);
  };

  const checkWindowSize = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust the threshold as per your needs
    console.log("Checking width");
  };

  const setNavbarOpenManually = () => {
    setNavbarOpen();
  };
  const ref = useRef();

  useEffect(() => {
    checkWindowSize();

    console.log("Update Effect");
    window.addEventListener("resize", checkWindowSize);
  }, [navbarOpen, isMobile, updateEffect]);

  if (!updateEffect) {
    if (navbarOpen && ref.current && !ref.current.contains(event.target)) {
      setNavbarOpen(false);
    }
    setUpdateEffect(true);
  }

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-logo-wrapper">
        <img className="navbar-logo" src="/logo.svg" alt="Logo" />
        <h3 className="navbar-title">analyze it</h3>
      </div>
      <div>
        {isMobile ? (
          // Hamburger menu content
          <>
            <button
              className="navbar-button-i toggle"
              onClick={handleMenuToggle}
            >
              {navbarOpen ? (
                <MdClose
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                />
              ) : (
                <FiMenu
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                />
              )}
            </button>
            <ul className={`menu-nav${navbarOpen ? " show-menu" : ""}`}>
              <li>
                <a href="calculator" className="navbar-link">
                  Tube Volume Calculator
                </a>
              </li>
              <li>
                <a href="calculator" className="navbar-link">
                  Irregular Area Calculator
                </a>
              </li>
              <li>
                <a href="calculator" className="navbar-link">
                  About
                </a>
              </li>
            </ul>
          </>
        ) : (
          // Regular navbar content
          <div className="navbar-desktop">
            <div className="navbar-links">
              <div className="nb-links">
                <a href="calculator" className="navbar-link">
                  Tube Volume Calculator
                </a>
                <a href="calculator" className="navbar-link">
                  Irregular Area Calculator
                </a>
                <a href="calculator" className="navbar-link">
                  {" "}
                  About
                </a>
              </div>
            </div>
            <div className="navbar-button-wrapper">
              <SimpleButton content={"Get Started"} link="#app-display" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
