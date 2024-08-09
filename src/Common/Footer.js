import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../Icon/logo.jpg";
import bocongthuong from "../Icon/bocongthuong.jpg";

const Footer = () => {
  
  return (
    <footer className="shadow">
      <div className="container py-5" style={{ width: "90%" }}>
        <div className="d-flex justify-content-between flex-wrap">
          <div style={{ marginTop: "40px" }}>
            <a href="/" className="d-flex align-items-center p-0 text-dark">
              <img
                src={logo}
                width="200px"
                style={{ boxShadow: "5px 10px #C0C0C0" }}
                alt="Logo"
              />
            </a>
            <div className="mt-4 d-flex" style={{ marginLeft: "40px" }}>
              <a href="#" className="me-4">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  style={{ fontSize: "30px", color: "#08030f" }}
                />
              </a>
              <a href="#" className="me-4">
                <FontAwesomeIcon
                  icon={faTwitter}
                  style={{ fontSize: "30px", color: "#08030f" }}
                />
              </a>
              <a href="#" className="me-4">
                <FontAwesomeIcon
                  icon={faInstagram}
                  style={{ fontSize: "30px", color: "#08030f" }}
                />
              </a>
            </div>
          </div>
          <div style={{ marginTop: "40px", textAlign: "left" }}>
            <div style={{ fontSize: "15px" }}>
              <p className="mb-2">
                <span style={{ fontWeight: "bold" }}>Địa chỉ:</span> 180 Cao Lỗ,
                Phường 4
              </p>
              <p className="mb-2">Quận 8, Tp. Hồ Chí Minh</p>
              <p>Điện thoại: (028) 38 505 520</p>
            </div>
          </div>
          <div>
            <img src={bocongthuong} width="200px" alt="Bo Cong Thuong" />
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9543420070145!2d106.67563805049893!3d10.738002462800189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f62a90e5dbd%3A0x674d5126513db295!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgU8OgaSBHw7Ju!5e0!3m2!1svi!2s!4v1668964773928!5m2!1svi!2s"
              width="400"
              height="250"
              frameborder="0"
              style={{ border: 0 }}
              allowfullscreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
        <small className="text-center mt-5">
          &copy; STU, 2022. Nguyễn Hải Vinh - DH51904906.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
