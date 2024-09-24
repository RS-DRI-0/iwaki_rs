import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../app/Actions/auth";
import Login from "./login/Login";

class UserLayout extends React.Component {
    render() {
        return (
            <Layout className="layoutUserLogin1">
                <Login />
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.token !== null,
        loading: state.auth.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(UserLayout)
);
