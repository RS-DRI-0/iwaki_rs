import React from "react";
import { Button } from "@mui/material";
import { Col, Input, Row, Table } from "antd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PropTypes from "prop-types";
import fileLanguage from "../../language.json";

const ManagementUserIndex = ({
  columns,
  listInforUserAll,
  onChangeTabsTable,
  items,
  showDrawerAddUser,
  handleTableChange,
  listInforUserFilter,
  page,
  handleSearchUser,
  valueSearch,
  checkValueSearch,
  activeKey,
  chooseLanguage,
}) => {
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const checkListInforUserFilter =
    listInforUserFilter.length !== 0 ? listInforUserFilter : listInforUserAll;

  return (
    <Row style={{ width: "100%", margin: "auto" }}>
      <Col span={24}>
        <div
          className="header-page-admin-user"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={screenWidth <= 1280 ? { width: "100%" } : { width: "70%" }}
          >
            <Row className="row-page-admin-user" style={{ marginTop: "4%" }}>
              <Col span={10}>{/* <h1>USER MANAGEMENT</h1> */}</Col>
              <Col span={14} className="header-page-admin-user-col-14">
                <Input
                  size="large"
                  style={{ width: "20%", marginRight: 10 }}
                  placeholder={fileLanguage[chooseLanguage].search}
                  value={checkValueSearch}
                  onChange={handleSearchUser}
                ></Input>
                <Button
                  variant="outlined"
                  className="header-page-admin-user-button"
                  startIcon={<PersonAddAltIcon />}
                  onClick={() => showDrawerAddUser(true)}
                >
                  {fileLanguage[chooseLanguage].add_user}
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <Row
          className="row-page-admin-user"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={screenWidth <= 1280 ? { width: "100%" } : { width: "70%" }}
          >
            <Table
              columns={columns}
              dataSource={
                checkValueSearch && checkValueSearch.length > 0
                  ? valueSearch
                  : checkListInforUserFilter
              }
              onChange={handleTableChange}
              scroll={{
                y: screenHeight - 295,
              }}
              pagination={page}
              size="middle"
              rowKey="stt"
              className="table-management-user"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          </div>
        </Row>
      </Col>
    </Row>
  );
};

ManagementUserIndex.propTypes = {
  columns: PropTypes.array,
  listInforUserAll: PropTypes.array,
  onChangeTabsTable: PropTypes.func,
  items: PropTypes.array,
  showDrawerAddUser: PropTypes.func,
  handleTableChange: PropTypes.func,
  listInforUserFilter: PropTypes.array,
  page: PropTypes.any,
  handleSearchUser: PropTypes.func,
  valueSearch: PropTypes.array,
  checkValueSearch: PropTypes.string,
  activeKey: PropTypes.string,
  chooseLanguage: PropTypes.any,
};

export default ManagementUserIndex;
