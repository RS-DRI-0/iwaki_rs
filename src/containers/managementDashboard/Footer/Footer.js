import React from "react";
import fileLanguage from "../../../language.json";
import PropTypes from "prop-types";

const Footer = ({ chooseLanguage }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ margin: "auto", fontSize: 15 }}>
      <div>
        {currentYear} © {fileLanguage[chooseLanguage].all_rights_reserved}
      </div>
    </footer>
  );
};

Footer.propTypes = {
  chooseLanguage: PropTypes.any,
};

export default Footer;
