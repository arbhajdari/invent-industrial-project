import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SideBar.css";

const slideImages = [
  `${process.env.PUBLIC_URL}/Biblio.jpg`,
  `${process.env.PUBLIC_URL}/CityCollege.jpg`,
  `${process.env.PUBLIC_URL}/Thess.jpg`,
];

const Sidebar = ({ onYearChange }) => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [sidebarStyle, setSidebarStyle] = useState({});

  const years = Array.from({ length: 18 }, (_, i) => 2025 - i);
  const leftColumnYears = years.slice(0, 9);
  const rightColumnYears = years.slice(9);

  const handleYearClick = (year) => {
    const newSelectedYears = [...selectedYears];
    const yearIndex = newSelectedYears.indexOf(year);

    if (yearIndex === -1) {
      newSelectedYears.push(year);
    } else {
      newSelectedYears.splice(yearIndex, 1);
    }

    setSelectedYears(newSelectedYears);
    onYearChange(newSelectedYears);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.querySelector(".sidebar");
      const projectsSection = document.querySelector(".projects-grid");
      const footer = document.querySelector(".footer-main");

      if (!sidebar || !projectsSection || !footer) return;

      const sidebarHeight = sidebar.offsetHeight;
      const projectsBottom = projectsSection.getBoundingClientRect().bottom;
      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;

      if (projectsBottom > sidebarHeight + 50 && footerTop > viewportHeight) {
        setSidebarStyle({
          position: "fixed",
          top: "20px",
        });
      } else if (footerTop <= viewportHeight) {
        setSidebarStyle({
          position: "absolute",
          top: `${footerTop - sidebarHeight - 20}px`,
        });
      } else {
        setSidebarStyle({
          position: "absolute",
          top: "84px",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="sidebar" style={sidebarStyle}>
      <div className="filter-section">
        <h3 className="filter-title">Filter by Year</h3>
        <div className="year-grid">
          <div className="year-column">
            {leftColumnYears.map((year) => (
              <div
                key={year}
                className={`year-item ${
                  selectedYears.includes(year) ? "selected" : ""
                }`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </div>
            ))}
          </div>
          <div className="year-column">
            {rightColumnYears.map((year) => (
              <div
                key={year}
                className={`year-item ${
                  selectedYears.includes(year) ? "selected" : ""
                }`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="slideshow-section">
        <Slider {...sliderSettings}>
          {slideImages.map((image, index) => (
            <div key={index} className="slide">
              <img src={image} alt={`University ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="university-info">
        <p className="info-text">
          Discover innovative projects from our university's brightest minds.
          Each project represents our commitment to excellence and innovation.
        </p>
        <p className="question-text">Interested in collaborating with us?</p>
        <Link to="/contact" className="contact-button">
          Contact Us
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
