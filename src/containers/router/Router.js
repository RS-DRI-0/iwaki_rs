// eslint-disable-next-line no-useless-rename
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { useEffect } from 'react';
import UserLayout from "../UserLayout";
import { authSuccess } from "../../app/Actions/auth";
import NotPermission from "../notPermission";
import NotfoundLayout from "../notfoundLayout";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { CustomLayout } from "../../layout/Layout";
import { CustomNoLayout } from "../../layout/Layout2.js/Layout2";
import InputCheck from "../inputCheck/InsertInformationCheck";
import FormSelect2 from "../formSelect/formSelect2";
import CameraFormLK_1 from "../Camera/cameraFormLK_1";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import PageNotification from "../management_of_user/page_notification/PageNotification";
import ManagementUser from "../managementUser";
import { CustomLayoutAdmin } from "../../layout/LayoutAdmin/LayoutAdmin";
import LastCheck from "../last_check/LastCheck";
import ManagementDashboardIndex from "../managementDashboard";
import InsertInformationIndex from "../input";
import Entry_Classification from "../entry_classification";
import Check_Classification from "../check_classification";
import PropTypes from "prop-types";
import ContainerFileManager from "../management_of_user/ContainerFileManager";

const cookies = new Cookies();

// const ContainerFileManager = lazy(() => import('../management_of_user/ContainerFileManager'));

function PageTitleUpdater() {
  const location = useLocation();

  const pathToTitleMap = {
    "/CaptureCamera": "Camera",
    "/management": "Management",
    "/entry": "Entry",
    "/entry_classification": "CLF",
    "/check_classification": "CHECK_CLF",
    "/check": "Check",
    "/last_check": "Last check",
    "/user": "User",
  };

  useEffect(() => {
    const path = location.pathname;
    const baseTitle = "IWAKI";
    const pageTitle = pathToTitleMap[path]
      ? `${pathToTitleMap[path]} - ${baseTitle}`
      : baseTitle;
    document.title = pageTitle;
  }, [location]);

  return null;
}

function Main() {
  const dispatch = useDispatch();
  const lsPermissions = [sessionStorage.getItem("Role_Title")];

  let userId = "";
  if (
    sessionStorage.getItem("info_user") !== undefined &&
    sessionStorage.getItem("info_user") !== null
  ) {
    userId = JSON.parse(sessionStorage.getItem("info_user")).user_id;
  }

  const token = cookies.get(`token_iwaki_${userId}`);
  if (token) {
    dispatch(authSuccess(token));
  }

  let auth = token !== null && token !== undefined;

  if (lsPermissions[0] === null) {
    cookies.remove(`token_iwaki_${userId}`);
    cookies.remove(`refresh_iwaki_${userId}`);
    auth = false;
  }

  return (
    <Router>
      <PageTitleUpdater />
      <Switch>
        <ProtectLoginRoute exact path="/login" protect={auth}>
          <UserLayout>{/* <Login /> */}</UserLayout>
        </ProtectLoginRoute>

        <RouteWithLayout
          component={PageNotification}
          exact
          layout={CustomNoLayout}
          path="/notification"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["STAFF"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={InsertInformationIndex}
          exact
          layout={CustomLayout}
          path="/entry"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["ENTRY"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={Entry_Classification}
          exact
          layout={CustomLayout}
          path="/entry_classification"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["CLF"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={Check_Classification}
          exact
          layout={CustomLayout}
          path="/check_classification"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["CHECK_CLF"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={InputCheck}
          exact
          layout={CustomLayout}
          path="/check"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["CHECK"]}
          isLogged={auth}
        />
        <RouteWithLayout
          component={LastCheck}
          exact
          layout={CustomLayout}
          path="/last_check"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["LASTCHECK"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={FormSelect2}
          exact
          layout={CustomNoLayout}
          path="/formselect"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["STAFF"]}
          isLogged={auth}
        />
        <RouteWithLayout
          component={CameraFormLK_1}
          exact
          layout={CustomNoLayout}
          path="/CaptureCamera"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["STAFF"]}
          isLogged={auth}
        />
        <RouteWithLayout
          component={ContainerFileManager}
          exact
          layout={CustomNoLayout}
          path="/"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["STAFF"]}
          isLogged={auth}
        />
        {/* <RouteWithLayout
          component={Management}
          exact
          layout={CustomNoLayout}
          path="/lc-manager"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["APP_MANAGER"]}
          isLogged={auth}
        /> */}
        <RouteWithLayout
          component={ForgotPassword}
          exact
          layout={CustomNoLayout}
          path="/forgot-password"
          isPrivate={false}
          lsPermissions={[""]}
          permission={[""]}
          isLogged={false}
        />

        <RouteWithLayout
          component={ManagementUser}
          exact
          layout={CustomLayoutAdmin}
          path="/user"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["ADMIN"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={ManagementDashboardIndex}
          exact
          layout={CustomNoLayout}
          path="/management"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["APP_MANAGER"]}
          isLogged={auth}
        />

        <RouteWithLayout
          component={NotfoundLayout}
          layout={CustomLayout}
          path="/"
          lsPermissions={[""]}
          isPrivate={true}
          isLogged={auth}
          permission={"404"}
        />
      </Switch>
    </Router>
  );
}

const RouteWithLayout = (props) => {
  const {
    layout: Layout,
    isLogged,
    component: Component,
    isPrivate,
    lsPermissions,
    permission,
    path,
    ...rest
  } = props;

  const getRejectRoute = (type) => {
    if (type !== "404" && path !== "/") {
      type = "403";
    }

    switch (type) {
      case "403":
        return <NotPermission />;
      case "404":
        return <NotfoundLayout />;
      default:
        return <NotPermission />;
    }
  };

  const returnLogin = () => {
    window.location = "/login";
  };

  const renderComponent = () => {
    if (isPrivate) {
      if (!isLogged) {
        return returnLogin();
      }
      if (!lsPermissions || lsPermissions.length === 0) {
        return <span></span>;
      }
      if (!lsPermissions.some((r) => permission.includes(r))) {
        return getRejectRoute(permission);
      }
      return (
        <Layout isLogged={isLogged}>
          <Component {...props} />
        </Layout>
      );
    }

    return (
      <Layout isLogged={isLogged}>
        <Component {...props} />
      </Layout>
    );
  };

  return <Route {...rest} render={renderComponent} />;
};

RouteWithLayout.propTypes = {
  layout: PropTypes.any,
  isLogged: PropTypes.any,
  component: PropTypes.any,
  isPrivate: PropTypes.any,
  lsPermissions: PropTypes.any,
  permission: PropTypes.any,
  path: PropTypes.any,
};

const ProtectLoginRoute = ({
  protect,
  lsPermissionsType,
  lsPermissions,
  permission,
  user_info,
  children,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={() => (!protect ? children : <Redirect to={"/"}></Redirect>)}
    />
  );
};

ProtectLoginRoute.propTypes = {
  protect: PropTypes.any,
  lsPermissionsType: PropTypes.any,
  lsPermissions: PropTypes.any,
  permission: PropTypes.any,
  user_info: PropTypes.any,
  children: PropTypes.any,
};

export default Main;
