import * as React from "react";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "../Layout.css";
import HeaderAdmin from "./HeaderAdmin";
import PropTypes from "prop-types";
import FooterAdmin from "./FooterAdmin";

const CustomLayoutAdminFC = ({ children }) => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <main className="content1" style={{ flex: "1" }}>
            <HeaderAdmin />
            <div className="container-fluid" style={{ maxWidth: "100%" }}>
              {children}
            </div>
          </main>
          <FooterAdmin />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const CustomLayoutAdmin = ({ children }) => {
  return <CustomLayoutAdminFC>{children}</CustomLayoutAdminFC>;
};

CustomLayoutAdminFC.propTypes = {
  children: PropTypes.any,
};

CustomLayoutAdmin.propTypes = {
  children: PropTypes.any,
};
