import { Col, DatePicker, Row, Select, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import ChartQuatity from "./Chart/ChartQuatity";
import fileLanguage from "../../language.json";

const ManagementDashboardMobile = ({
  listPumb,
  chooseModel,
  handleDatePickerManagement,
  isValueDashBoard,
  chooseLanguage,
}) => {
  const currentDate = dayjs();

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
                fontWeight: 600,
              }}
            >
              {fileLanguage[chooseLanguage].quantity_of_checksheets}
            </span>
          </div>
          <div style={{ paddingTop: 30, height: 300 }}>
            <ChartQuatity
              isValueDashBoard={isValueDashBoard}
              chooseLanguage={chooseLanguage}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{ width: "50%", display: "flex", alignItems: "center" }}
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
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
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
          <div style={{ display: "flex", paddingTop: 10 }}>
            <div
              style={{ width: "50%", display: "flex", alignItems: "center" }}
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
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
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
          <div style={{ display: "flex", paddingTop: 10 }}>
            <div
              style={{ width: "50%", display: "flex", alignItems: "center" }}
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
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
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
      </Col>
    </Row>
  );
};

export default ManagementDashboardMobile;
