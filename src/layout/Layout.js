import * as React from "react";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./Layout.css";
import PropTypes from "prop-types";
import HeaderWeb from "./Header/HeaderWeb";

const CustomLayoutFC = ({ children }) => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: "flex", height: "100vh" }}>

          <main className="content1">
            {/* <NotificationSuccess /> */}
            <HeaderWeb />
            <div className="container-fluid" style={{ maxWidth: "100%" }}>
              {children}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};


export const CustomLayout = ({ children }) => {
  // Test
  return <CustomLayoutFC>{children}</CustomLayoutFC>;
};

CustomLayoutFC.propTypes = {
  children: PropTypes.any,
};

CustomLayout.propTypes = {
  children: PropTypes.any,
};
