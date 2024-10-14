import React from "react";
import { Col, DatePicker, Modal, Row } from "antd";
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
import PropTypes from "prop-types";
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

const ModalDailyAverage = ({
  isOpenModalDailyAverage,
  handleClickOpenModalDailyAverage,
  isValueDailyAverage,
  handleDatePickerModalDailyAverage,
  datePickerValue,
  chooseLanguage,
}) => {
  const valueDay = isValueDailyAverage.length;

  const calculateAverage = (array) => {
    if (array.length === 0) {
      return 0;
    }

    const total = array.reduce((acc, num) => acc + num, 0);
    const average = total / array.length;
    return Math.round(average);
  };

  const processedData = isValueDailyAverage.map((subArray) =>
    calculateAverage(subArray)
  );

  const generateData = (numDays) => {
    if (processedData.length < numDays) {
      console.error("processedData không đủ phần tử");
      return [];
    }

    // Trả về các giá trị từ `processedData`
    return processedData.slice(0, numDays);
  };

  const data = {
    labels: generateLabels(valueDay),
    datasets: [
      {
        data: generateData(valueDay),
        backgroundColor: "#6EBAE5",
        borderColor: "#6EBAE5",
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
              return `(${fileLanguage[chooseLanguage].mins})  ${value}`;
            }

            return value;
          },
        },
      },
    },
  };

  const screenWidth = window.innerWidth;
  const checkWidthScreen = screenWidth <= 1480 ? "90%" : "50%";

  return (
    <Modal
      open={isOpenModalDailyAverage}
      onCancel={handleClickOpenModalDailyAverage}
      width={checkWidthScreen}
      className="modal-shortcut"
      footer={false}
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
            {fileLanguage[chooseLanguage].daily_average_processing_time}
          </span>
          <DatePicker
            defaultValue={datePickerValue}
            value={datePickerValue}
            format={"MM-YYYY"}
            style={{ width: "20%", marginLeft: 20 }}
            picker="month"
            allowClear={false}
            onChange={handleDatePickerModalDailyAverage}
          />
        </Col>
        <Col span={24}>
          <Bar data={data} options={options} />
        </Col>
      </Row>
    </Modal>
  );
};

ModalDailyAverage.propTypes = {
  isOpenModalDailyAverage: PropTypes.bool,
  handleClickOpenModalDailyAverage: PropTypes.func,
  isValueDailyAverage: PropTypes.array,
  handleDatePickerModalDailyAverage: PropTypes.func,
  datePickerValue: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ModalDailyAverage;
