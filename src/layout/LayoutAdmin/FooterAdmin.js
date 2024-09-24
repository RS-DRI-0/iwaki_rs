import React from "react";

const FooterAdmin = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ margin: "auto", fontSize: 15 }}>
      <div>{currentYear} © All rights reserved. Rainscales</div>
    </footer>
  );
};

export default FooterAdmin;
