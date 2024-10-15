import { Col, DatePicker, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import ChartQuatity from "./Chart/ChartQuatity";
import fileLanguage from "../../language.json";
import "./style.scss";
import { Button } from "@mui/material";
import { ClockCircleOutlined } from "@ant-design/icons";
import ModalCheckSheets from "./Modal/ModalCheckSheets";
import ModalDaily from "./Modal/ModalDaily";
import ModalDailyAverage from "./Modal/ModalDailyAverage";
import moment from "moment";

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

const ManagementDashboardMobile = ({
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
      // width: 150,
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
      // width: 180,
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
      // width: 120,
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
      // width: 120,
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
    <Row
      style={{ width: "95%", margin: "auto", paddingTop: "30px" }}
      className="management-dashboard-mobile"
    >
      <Col span={24}>
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
      <Col
        span={24}
        className="management-dashboard-mobile-col"
        style={{ marginTop: 20 }}
      >
        <div style={{ padding: 10 }}>
          <div>
            <span
              style={{
                display: "flex",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {fileLanguage[chooseLanguage].quantity_of_checksheets}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ paddingTop: 30, height: 300, width: "60%" }}>
              <ChartQuatity
                isValueDashBoard={isValueDashBoard}
                chooseLanguage={chooseLanguage}
              />
            </div>
            <div style={{ width: "40%", margin: "auto" }}>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tag color="#626262" style={{ width: 40, height: 20 }}></Tag>
                  <span
                    className="management-dashboard-span-status"
                    data-status-color-processing={true}
                    data-mobile={true}
                  >
                    {fileLanguage[chooseLanguage].processing}
                  </span>
                </div>
                <div
                  style={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                >
                  <span
                    className="management-dashboard-span-total"
                    data-total-color-processing={true}
                    data-mobile={true}
                  >
                    {isValueDashBoard.stt_processing === "[]"
                      ? 0
                      : isValueDashBoard.stt_processing}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", paddingTop: 30 }}>
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tag color="#085FA0" style={{ width: 40, height: 20 }}></Tag>
                  <span
                    className="management-dashboard-span-status"
                    data-status-color-completed={true}
                    data-mobile={true}
                  >
                    {fileLanguage[chooseLanguage].completed}
                  </span>
                </div>
                <div
                  style={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                >
                  <span
                    className="management-dashboard-span-total"
                    data-total-color-completed={true}
                    data-mobile={true}
                  >
                    {isValueDashBoard.stt_complete === "[]"
                      ? 0
                      : isValueDashBoard.stt_complete}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", paddingTop: 30 }}>
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tag color="#577354" style={{ width: 40, height: 20 }}></Tag>
                  <span
                    className="management-dashboard-span-status"
                    data-status-color-verified={true}
                    data-mobile={true}
                  >
                    {fileLanguage[chooseLanguage].verified}
                  </span>
                </div>
                <div
                  style={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                >
                  <span
                    className="management-dashboard-span-total"
                    data-total-color-verified={true}
                    data-mobile={true}
                  >
                    {isValueDashBoard.stt_verified === "[]"
                      ? 0
                      : isValueDashBoard.stt_verified}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              className="management-dashboard-button-view"
              data-check-float={true}
              onClick={handleClickOpenModalChecksheets}
            >
              {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
            </Button>
          </div>
        </div>
      </Col>
      <Col
        span={24}
        className="management-dashboard-mobile-col"
        style={{ marginTop: 20 }}
      >
        <div style={{ padding: 10 }}>
          <div>
            <span
              style={{
                display: "flex",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {fileLanguage[chooseLanguage].quantity_of_last_check}
            </span>
          </div>
          <div style={{ display: "flex", marginTop: 20, marginBottom: 10 }}>
            <div
              style={{
                background: "#f60505",
                width: "48%",
                borderRadius: 10,
                padding: 15,
              }}
            >
              <div>
                <span
                  className="management-dashboard-span-ratio-mobile"
                  data-check-percent={true}
                >
                  {isValueDashBoard.ratio_not_qualified}%
                </span>
              </div>
              <div>
                <span className="management-dashboard-span-ratio-mobile">
                  {fileLanguage[chooseLanguage].ratio_of_non_qualified}
                </span>
              </div>
            </div>
            <div style={{ width: "4%" }}></div>
            <div
              style={{
                background: "#ff8c00",
                width: "48%",
                borderRadius: 10,
                padding: 15,
              }}
            >
              <div>
                <span
                  className="management-dashboard-span-ratio-mobile"
                  data-check-percent={true}
                >
                  {isValueDashBoard.ratio_notgood}%
                </span>
              </div>
              <div>
                <span className="management-dashboard-span-ratio-mobile">
                  {fileLanguage[chooseLanguage].ratio_of_images_not_good}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Button
              className="management-dashboard-button-view"
              data-check-float={true}
              onClick={handleClickOpenModalChecksheets}
            >
              {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
            </Button>
          </div>
        </div>
      </Col>
      <Col
        span={24}
        className="management-dashboard-mobile-col"
        style={{ marginTop: 20 }}
      >
        <div style={{ padding: 10 }}>
          <div>
            <span
              style={{
                display: "flex",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {
                fileLanguage[chooseLanguage]
                  .average_time_of_last_check_per_checksheet
              }
            </span>
          </div>
          <div style={{ display: "flex", marginTop: 5, marginBottom: 5 }}>
            <div
              style={{
                width: "80%",
              }}
            >
              <span
                style={{
                  fontSize: 25,
                  fontWeight: 600,
                }}
              >
                {isValueAverageTimeLc} {fileLanguage[chooseLanguage].mins}
              </span>
            </div>
            <div style={{ width: "20%" }}>
              <Button style={{ background: "#ffe5ec", float: "right" }}>
                <ClockCircleOutlined
                  style={{ fontSize: 25, color: "#fb6f92" }}
                />
              </Button>
            </div>
          </div>
          <div>
            <Button
              className="management-dashboard-button-view"
              data-check-float={true}
              onClick={handleClickOpenModalChecksheets}
            >
              {fileLanguage[chooseLanguage].view_daily_statistics_by_month}
            </Button>
          </div>
        </div>
      </Col>
      <Col
        span={24}
        className="management-dashboard-mobile-col"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <div style={{ padding: "20px 10px 10px 10px" }}>
          {/* <div style={{ textAlign: "center" }}>
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
          </div> */}
          <div style={{ display: "flex", marginTop: 5, marginBottom: 5 }}>
            {/* {isOpenTable === true && ( */}
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={
                  checkClickSearch === true ? valueSearch : listPackageAll
                }
                scroll={{
                  // y: screenHeight - 680,
                  x: "max-content",
                }}
                size="small"
                className="management-dashboard-table"
                locale={{
                  emptyText: fileLanguage[chooseLanguage].content_no_data,
                }}
              />
            </Col>
            {/* )} */}
          </div>
        </div>
      </Col>

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

export default ManagementDashboardMobile;
