import { Col, DatePicker, Modal, Row } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import fileLanguage from "../../../language.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const generateLabels = (numDays) => {
  return Array.from({ length: numDays }, (_, i) => `${i + 1}`);
};

// Generate random data for 30 days

const ModalCheckSheets = ({
  isOpenModalChecksheets,
  handleClickOpenModalChecksheets,
  isValueCheckSheets,
  handleDatePickerModalCheckSheet,
  datePickerValue,
  chooseLanguage,
}) => {
  const valueDay = isValueCheckSheets.length;

  const generateData = (numDays) => {
    if (isValueCheckSheets.length < numDays) {
      console.error("isValueCheckSheets không đủ phần tử");
      return [];
    }

    // Trả về các giá trị từ `isValueCheckSheets`
    return isValueCheckSheets.slice(0, numDays);
  };

  const data = {
    labels: generateLabels(valueDay),
    datasets: [
      {
        data: generateData(valueDay),
        backgroundColor: "#01707C",
        borderColor: "#01707C",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Tắt hiển thị tên và màu
      },
      centerText: {
        display: false, // Set to false to not display the center text
      },
      datalabels: {
        display: false, //tắt hiển thị ChartDataLabels
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: function (value, index, values) {
            if (index === values.length - 1) {
              return `(${fileLanguage[chooseLanguage].checksheets})  ${value}`;
            }

            return value;
          },
        },
      },
    },
  };

  const screenWidth = window.innerWidth;
  const checkWidthScreen = screenWidth <= 1024 ? "90%" : "50%";

  return (
    <Modal
      open={isOpenModalChecksheets}
      onCancel={handleClickOpenModalChecksheets}
      width={checkWidthScreen}
      className="modal-shortcut"
      footer={false}
      maskClosable={false}
    >
      <Row>
        <Col
          span={24}
          style={{ paddingTop: 10, paddingBottom: 20, display: "flex" }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {
              fileLanguage[chooseLanguage]
                .daily_total_checksheets_statistics_by_month
            }
          </span>
          <DatePicker
            defaultValue={datePickerValue}
            value={datePickerValue}
            format={"MM-YYYY"}
            style={{ width: "20%", marginLeft: 20 }}
            picker="month"
            allowClear={false}
            onChange={handleDatePickerModalCheckSheet}
          />
        </Col>
        <Col span={24}>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ width: "912px" }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

ModalCheckSheets.propTypes = {
  isOpenModalChecksheets: PropTypes.bool,
  handleClickOpenModalChecksheets: PropTypes.func,
  isValueCheckSheets: PropTypes.array,
  handleDatePickerModalCheckSheet: PropTypes.func,
  datePickerValue: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ModalCheckSheets;
