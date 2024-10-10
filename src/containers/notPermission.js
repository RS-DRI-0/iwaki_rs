import React from "react";

import { Button, Result } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

const BlankLayout = () => {
  const role_title = sessionStorage.getItem("Role_Title");

  return (
    <Result
      status="403"
      title="403"
      className={"not-found-page"}
      subTitle="You can not access this page."
      extra={
        <>
          {role_title === "ENTRY" && (
            <Link to={"/entry"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "CHECK" && (
            <Link to={"/check"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "LASTCHECK" && (
            <Link to={"/last_check"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "ADMIN" && (
            <Link to={"/user"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "STAFF" && (
            <Link to={"/"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "APP_MANAGER" && (
            <Link to={"/management"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "CLF" && (
            <Link to={"/entry_classification"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
          {role_title === "CHECK_CLF" && (
            <Link to={"/check_classification"}>
              <Button type="primary">Back to the home page</Button>
            </Link>
          )}
        </>
      }
    />
  );
};

export default withRouter(connect()(BlankLayout));
