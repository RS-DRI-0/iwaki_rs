/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Col, DatePicker, Input, Row, Select, Table, Tag } from "antd";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./style.scss";
import ModalCheckSheets from "./Modal/ModalCheckSheets";
import ModalDaily from "./Modal/ModalDaily";
import ModalDailyAverage from "./Modal/ModalDailyAverage";
import ChartQuatity from "./Chart/ChartQuatity";
import ClearDataSearch from "./Button/ClearDataSearch";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import fileLanguage from "../../language.json";

const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

const dataColor = [
  {
    id: 1,
    name: "Qualified",
    color: "#329B00",
  },
  {
    id: 2,
    name: "Not Qualified",
    color: "#B92121",
  },
  {
    id: 3,
    name: "Image Not Good",
    color: "#FF8C00",
  },
  {
    id: 4,
    name: "Processing",
    color: "#000000",
  },
];

const ManagementDashboard = ({
  isOpenModalChecksheets,
  handleClickOpenModalChecksheets,
  isOpenModalDailyLC,
  handleClickOpenModalDailyLC,
  isOpenModalDailyAverage,
  handleClickOpenModalDailyAverage,
  isOpenTable,
  listPackageAll,
  isValueDashBoard,
  isValueCheckSheets,
  isValueDailyNotqualified,
  isValueDailyNG,
  isValueDailyAll,
  isValueDailyAverage,
  handleClickButtonOpenTable,
  handleDatePickerModalCheckSheet,
  handleDatePickerModalDaily,
  handleDatePickerModalDailyAverage,
  handleDatePickerManagement,
  handleSearchTableManagemant,
  valueSearch,
  checkValueSearch,
  handleChangeResult,
  handleClickSearch,
  handleChangeStatus,
  checkClickSearch,
  checkValueStatus,
  checkValueResult,
  isValueAverageTimeLc,
  handleClearDataSearch,
  listPumb,
  chooseModel,
  datePickerValue,
  chooseLanguage,
}) => {
  const currentDate = dayjs();

  const columns = [
    {
      title: fileLanguage[chooseLanguage].package_name,
      dataIndex: "pack_name",
      key: "pack_name",
    },
    {
      title: fileLanguage[chooseLanguage].mfg_no,
      dataIndex: "vl_mfg_no",
      key: "vl_mfg_no",
      render: (text) => {
        if (text === "Undefined") {
          return fileLanguage[chooseLanguage].undefined;
        } else {
          return text;
        }
      },
    },
    {
      title: fileLanguage[chooseLanguage].model_name,
      dataIndex: "vl_model_name",
      key: "vl_model_name",
      render: (text) => {
        if (text === "Undefined") {
          return fileLanguage[chooseLanguage].undefined;
        } else {
          return text;
        }
      },
    },
    {
      title: fileLanguage[chooseLanguage].checksheets_quantity,
      dataIndex: "total_checksheet",
      key: "total_checksheet",
      align: "center",
      render: (text) => {
        if (text === "Undefined") {
          return fileLanguage[chooseLanguage].undefined;
        } else {
          return text;
        }
      },
    },
    {
      title: fileLanguage[chooseLanguage].status,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        if (text === "Verified") {
          return fileLanguage[chooseLanguage].verified;
        } else if (text === "Processing") {
          return fileLanguage[chooseLanguage].processing;
        } else if (text === "Completed") {
          return fileLanguage[chooseLanguage].completed;
        }
      },
    },
    {
      title: fileLanguage[chooseLanguage].result,
      dataIndex: "result",
      key: "result",
      align: "center",
      render: (text) =>
        dataColor.map((tag) => {
          if (tag.name === text) {
            if (text === "Processing") {
              return (
                <span style={{ color: tag.color }} key={tag.id}>
                  {fileLanguage[chooseLanguage].processing}
                </span>
              );
            } else if (text === "Qualified") {
              return (
                <span style={{ color: tag.color }} key={tag.id}>
                  {fileLanguage[chooseLanguage].qualified}
                </span>
              );
            } else if (text === "Not Qualified") {
              return (
                <span style={{ color: tag.color }} key={tag.id}>
                  {fileLanguage[chooseLanguage].not_qualified}
                </span>
              );
            } else if (text === "Image Not Good") {
              return (
                <span style={{ color: tag.color }} key={tag.id}>
                  {fileLanguage[chooseLanguage].images_not_good}
                </span>
              );
            }
          }
          return null;
        }),
    },
    {
      title: fileLanguage[chooseLanguage].uploaded_by,
      dataIndex: "upload_usname",
      key: "upload_usname",
      align: "center",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={text} // Tooltip on hover to show full text
        >
          {text}
        </div>
      ),
    },
    {
      title: fileLanguage[chooseLanguage].upload_time,
      dataIndex: "upload_date",
      key: "upload_date",
      align: "center",
      render: (text) => {
        if (text) {
          // Extract the time part using moment.js
          const time = moment(text).format("HH:mm:ss");
          return time;
        } else {
          // Handle cases where upload_date might be empty
          return "-"; // Or any placeholder you prefer
        }
      },
    },
  ];

  return (
    <Row style={{ marginTop: 30 }}>
      <Col span={11} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {listPumb.length !== 0 && (
            <Select
              size={"middle"}
              id="code_city"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "20%", marginRight: 10 }}
              optionFilterProp="children"
              placeholder="Chọn mã máy"
              onChange={chooseModel}
              defaultValue={listPumb[0].pumb_model}
            >
              {listPumb.map((item, index) => (
                <Select.Option
                  key={item.pumb_id}
                  value={item.pumb_id}
                  is_multi={item.is_multi}
                >
                  {item.pumb_model}
                </Select.Option>
              ))}
            </Select>
          )}
          <DatePicker
            format={"DD-MM-YYYY"}
            defaultValue={currentDate}
            allowClear={false}
            onChange={handleDatePickerManagement}
            className="management-dashboard-date-picker"
          />
        </div>
      </Col>
      <Col span={11} offset={2} style={{ marginBottom: 20 }}></Col>
      <Col span={11}>
        <div
          style={{ display: "flex", justifyContent: "center", width: "78%" }}
        >
          <span
            style={{
              display: "flex",
              fontWeight: 500,
            }}
          >
            {fileLanguage[chooseLanguage].quantity_of_checksheets}
          </span>
        </div>
        <Row>
          <Col span={14} style={{ height: 200, marginTop: 30 }}>
            <div style={{ float: "right", height: "100%" }}>
              <ChartQuatity
                isValueDashBoard={isValueDashBoard}
                chooseLanguage={chooseLanguage}
              />
            </div>
          </Col>
          <Col span={1}></Col>
          <Col span={9} style={{ margin: "auto" }}>
            <div style={{ display: "flex" }}>
              <Tag color="#626262" style={{ width: 40, height: 20 }}></Tag>
              <span
                className="management-dashboard-span-status"
                data-status-color-processing={true}
              >
                {fileLanguage[chooseLanguage].processing}
              </span>
              <span
                className="management-dashboard-span-total"
                data-total-color-processing={true}
              >
                {isValueDashBoard.stt_processing === "[]"
                  ? 0
                  : isValueDashBoard.stt_processing}
              </span>
            </div>
            <div style={{ display: "flex", marginTop: 10 }}>
              <Tag color="#085FA0" style={{ width: 40, height: 20 }}></Tag>
              <span
                className="management-dashboard-span-status"
                data-status-color-completed={true}
              >
                {fileLanguage[chooseLanguage].completed}
              </span>
              <span
                className="management-dashboard-span-total"
                data-total-color-completed={true}
              >
                {isValueDashBoard.stt_complete === "[]"
                  ? 0
                  : isValueDashBoard.stt_complete}
              </span>
            </div>
            <div style={{ display: "flex", marginTop: 10 }}>
              <Tag color="#577354" style={{ width: 40, height: 20 }}></Tag>
              <span
                className="management-dashboard-span-status"
                data-status-color-verified={true}
              >
                {fileLanguage[chooseLanguage].verified}
              </span>
              <span
                className="management-dashboard-span-total"
                data-total-color-verified={true}
              >
                {isValueDashBoard.stt_verified === "[]"
                  ? 0
                  : isValueDashBoard.stt_verified}
              </span>
            </div>
          </Col>
        </Row>
        <Button
          className="management-dashboard-button-view"
          data-check-float={true}
          onClick={handleClickOpenModalChecksheets}
        >
          {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
        </Button>
      </Col>
      <Col span={11} offset={2}>
        <Row style={{ display: "flex", height: "100%" }}>
          <Col span={11} style={{ margin: "auto" }}>
            <span
              style={{
                display: "flex",
                fontWeight: 500,
              }}
            >
              {fileLanguage[chooseLanguage].quantity_of_last_check}
            </span>
            <div className="management-dashboard-div-ratio">
              <Col span={18}>
                <span className="management-dashboard-span-ratio">
                  {fileLanguage[chooseLanguage].ratio_of_non_qualified}
                </span>
              </Col>
              <Col span={6}>
                <span
                  className="management-dashboard-span-ratio"
                  data-check-percent={true}
                >
                  {isValueDashBoard.ratio_not_qualified}%
                </span>
              </Col>
            </div>
            <div
              className="management-dashboard-div-ratio"
              data-color-ratio={true}
            >
              <Col span={18}>
                <span className="management-dashboard-span-ratio">
                  {fileLanguage[chooseLanguage].ratio_of_images_not_good}
                </span>
              </Col>
              <Col span={6}>
                <span
                  className="management-dashboard-span-ratio"
                  data-check-percent={true}
                >
                  {isValueDashBoard.ratio_notgood}%
                </span>
              </Col>
            </div>
          </Col>
          <Col span={13}></Col>
          <Col span={11}></Col>
          <Col span={13}>
            <Button
              className="management-dashboard-button-view"
              data-check-margin-top={true}
              onClick={handleClickOpenModalDailyLC}
            >
              {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
            </Button>
          </Col>
          <Col
            span={11}
            style={{ margin: "auto" }}
            className="management-dashboard-row-col-right"
          >
            <span
              style={{
                display: "flex",
                fontWeight: 500,
              }}
            >
              {
                fileLanguage[chooseLanguage]
                  .average_time_of_last_check_per_checksheet
              }
            </span>
          </Col>
          <Col span={13} className="management-dashboard-row-col-right">
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {isValueAverageTimeLc} {fileLanguage[chooseLanguage].mins}
            </span>
          </Col>
          <Col span={11}></Col>
          <Col span={13}>
            <Button
              className="management-dashboard-button-view"
              data-check-margin-top={true}
              onClick={handleClickOpenModalDailyAverage}
            >
              {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
            </Button>
          </Col>
        </Row>
      </Col>
      <Row style={{ width: "98%", margin: "auto", marginTop: "50px" }}>
        <Col
          span={10}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            endIcon={
              isOpenTable === false ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )
            }
            onClick={handleClickButtonOpenTable}
            style={{ fontSize: 16, fontWeight: 400 }}
            className="management-dashboard-button-view-list-of-lc"
          >
            {fileLanguage[chooseLanguage].view_lists_of_lc_order}
          </Button>
        </Col>
        <Col span={14}></Col>
        <Col span={10}></Col>
        <Col span={14}>
          {isOpenTable === true && (
            <Row style={{ width: "100%" }}>
              <Col span={5}></Col>
              <Col span={1}>
                <ClearDataSearch
                  handleClearDataSearch={handleClearDataSearch}
                />
              </Col>
              <Col span={4} style={{ margin: "auto" }}>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder={fileLanguage[chooseLanguage].status}
                  value={checkValueStatus}
                  onChange={handleChangeStatus}
                  allowClear
                  options={[
                    {
                      value: "Processing",
                      label: fileLanguage[chooseLanguage].processing,
                    },
                    {
                      value: "Completed",
                      label: fileLanguage[chooseLanguage].completed,
                    },
                    {
                      value: "Verified",
                      label: fileLanguage[chooseLanguage].verified,
                    },
                  ]}
                />
              </Col>
              <Col span={4} offset={1} style={{ margin: "auto" }}>
                <Select
                  style={{
                    width: "100%",
                  }}
                  value={checkValueResult}
                  placeholder={fileLanguage[chooseLanguage].result}
                  onChange={handleChangeResult}
                  allowClear
                  options={[
                    {
                      value: "Processing",
                      label: fileLanguage[chooseLanguage].processing,
                    },
                    {
                      value: "Qualified",
                      label: fileLanguage[chooseLanguage].qualified,
                    },
                    {
                      value: "Not Qualified",
                      label: fileLanguage[chooseLanguage].not_qualified,
                    },
                    {
                      value: "Image Not Good",
                      label: fileLanguage[chooseLanguage].images_not_good,
                    },
                  ]}
                />
              </Col>
              <Col span={5} offset={1} style={{ margin: "auto" }}>
                <Input
                  placeholder={
                    fileLanguage[chooseLanguage].search +
                    " " +
                    fileLanguage[chooseLanguage].mfg_no +
                    "," +
                    fileLanguage[chooseLanguage].model_name
                  }
                  suffix={<SearchOutlined />}
                  value={checkValueSearch}
                  onChange={handleSearchTableManagemant}
                  className="management-dashboard-input-search"
                />
              </Col>
              <Col
                span={screenWidth < 1788 ? 3 : 2}
                offset={1}
                style={{ margin: "auto" }}
              >
                <Button variant="outlined" onClick={handleClickSearch}>
                  {fileLanguage[chooseLanguage].search}
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {isOpenTable === true && (
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={
              checkClickSearch === true ? valueSearch : listPackageAll
            }
            scroll={{
              y: screenHeight - 680,
            }}
            size="small"
            className="management-dashboard-table"
          />
        </Col>
      )}

      <ModalCheckSheets
        isOpenModalChecksheets={isOpenModalChecksheets}
        handleClickOpenModalChecksheets={handleClickOpenModalChecksheets}
        isValueCheckSheets={isValueCheckSheets}
        handleDatePickerModalCheckSheet={handleDatePickerModalCheckSheet}
        datePickerValue={datePickerValue}
        chooseLanguage={chooseLanguage}
      />

      <ModalDaily
        isOpenModalDailyLC={isOpenModalDailyLC}
        handleClickOpenModalDailyLC={handleClickOpenModalDailyLC}
        isValueDailyNotqualified={isValueDailyNotqualified}
        isValueDailyNG={isValueDailyNG}
        isValueDailyAll={isValueDailyAll}
        handleDatePickerModalDaily={handleDatePickerModalDaily}
        datePickerValue={datePickerValue}
        chooseLanguage={chooseLanguage}
      />

      <ModalDailyAverage
        isOpenModalDailyAverage={isOpenModalDailyAverage}
        handleClickOpenModalDailyAverage={handleClickOpenModalDailyAverage}
        isValueDailyAverage={isValueDailyAverage}
        handleDatePickerModalDailyAverage={handleDatePickerModalDailyAverage}
        datePickerValue={datePickerValue}
        chooseLanguage={chooseLanguage}
      />
    </Row>
  );
};

ManagementDashboard.propTypes = {
  isOpenModalChecksheets: PropTypes.bool,
  handleClickOpenModalChecksheets: PropTypes.func,
  isOpenModalDailyLC: PropTypes.bool,
  handleClickOpenModalDailyLC: PropTypes.func,
  isOpenModalDailyAverage: PropTypes.bool,
  handleClickOpenModalDailyAverage: PropTypes.func,
  isOpenTable: PropTypes.bool,
  listPackageAll: PropTypes.array,
  isValueDashBoard: PropTypes.any,
  isValueCheckSheets: PropTypes.array,
  isValueDailyNotqualified: PropTypes.array,
  isValueDailyNG: PropTypes.array,
  isValueDailyAll: PropTypes.array,
  isValueDailyAverage: PropTypes.array,
  handleClickButtonOpenTable: PropTypes.func,
  handleDatePickerModalCheckSheet: PropTypes.func,
  handleDatePickerModalDaily: PropTypes.func,
  handleDatePickerModalDailyAverage: PropTypes.func,
  handleDatePickerManagement: PropTypes.func,
  handleSearchTableManagemant: PropTypes.func,
  valueSearch: PropTypes.array,
  checkValueSearch: PropTypes.any,
  handleChangeResult: PropTypes.func,
  handleClickSearch: PropTypes.func,
  handleChangeStatus: PropTypes.func,
  checkClickSearch: PropTypes.any,
  checkValueStatus: PropTypes.any,
  checkValueResult: PropTypes.any,
  isValueAverageTimeLc: PropTypes.any,
  handleClearDataSearch: PropTypes.func,
  listPumb: PropTypes.array,
  chooseModel: PropTypes.func,
  datePickerValue: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ManagementDashboard;
