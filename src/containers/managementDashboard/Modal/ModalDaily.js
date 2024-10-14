import { Col, DatePicker, Modal, Row } from "antd";
import React, { useState, useEffect } from "react";
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

const ModalDaily = ({
  isOpenModalDailyLC,
  handleClickOpenModalDailyLC,
  isValueDailyNotqualified,
  isValueDailyNG,
  isValueDailyAll,
  handleDatePickerModalDaily,
  datePickerValue,
  chooseLanguage,
}) => {
  const valueDayNotqualified = isValueDailyNotqualified.length;
  const valueDayNG = isValueDailyNG.length;

  const [percentageNG, setPercentageNG] = useState([]);
  const [percentageNotqualified, setPercentageNotqualified] = useState([]);

  useEffect(() => {
    const calculatePercentages = () => {
      const percentagesNG = isValueDailyAll.map((value, index) => {
        const totalAll = value;
        const totalNg = isValueDailyNG[index];
        const percentage = (totalNg / totalAll) * 100 || 0;
        return Math.floor(percentage);
      });

      const percentagesNotqualified = isValueDailyAll.map((value, index) => {
        const totalAll = value;
        const totalNotQualified = isValueDailyNotqualified[index];
        const percentage = (totalNotQualified / totalAll) * 100 || 0;
        return Math.floor(percentage);
      });
      setPercentageNG(percentagesNG);
      setPercentageNotqualified(percentagesNotqualified);
    };

    calculatePercentages();
  }, [isValueDailyAll, isValueDailyNG, isValueDailyNotqualified]);

  const generateDataNotqualified = (numDays) => {
    // Trả về các giá trị từ `isValueDaily`
    if (percentageNotqualified.length < numDays) {
      console.error("percentageNotqualified không đủ phần tử");
      return [];
    }
    return percentageNotqualified.slice(0, numDays);
  };

  const generateDataNG = (numDays) => {
    // Trả về các giá trị từ `isValueDaily`
    if (percentageNG.length < numDays) {
      console.error("percentageNG không đủ phần tử");
      return [];
    }

    return percentageNG.slice(0, numDays);
  };

  const data = {
    labels: generateLabels(valueDayNotqualified),
    datasets: [
      {
        data: generateDataNotqualified(valueDayNotqualified),
        backgroundColor: "#e76f51",
      },
      {
        data: generateDataNG(valueDayNG),
        backgroundColor: "#e9c46a",
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              label += context.raw + "%";
            }
            return label;
          },
        },
      },
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
              return `(%)  ${value}`;
            }

            return value;
          },
          max: 100,
        },
        max: 100,
      },
    },
  };

  const addTextPlugin = {
    id: "addTextPlugin",
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];
          if (value >= 5) {
            ctx.save();
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#40404087";
            ctx.font = "10px Arial";
            ctx.fillText(`${value}%`, bar.x, bar.y + 10);
            ctx.restore();
          }
        });
      });
    },
  };

  const screenWidth = window.innerWidth;
  const checkWidthScreen = screenWidth <= 1480 ? "90%" : "50%";

  return (
    <Modal
      open={isOpenModalDailyLC}
      onCancel={handleClickOpenModalDailyLC}
      width={checkWidthScreen}
      className="modal-shortcut"
      footer={false}
    >
      <Row>
        <Col span={24} className="management-dashboard-modal-daily-title">
          <span className="management-dashboard-modal-daily-title-span">
            {
              fileLanguage[chooseLanguage]
                .daily_last_check_quality_statistics_by_month
            }
          </span>
          <DatePicker
            defaultValue={datePickerValue}
            value={datePickerValue}
            format={"MM-YYYY"}
            className="management-dashboard-modal-daily-date-picker"
            picker="month"
            allowClear={false}
            onChange={handleDatePickerModalDaily}
          />
        </Col>
        <Col span={24}>
          <Bar data={data} options={options} plugins={[addTextPlugin]} />
        </Col>
        <Col span={24} className="management-dashboard-modal-col-daily">
          <div
            className="management-dashboard-modal-daily-status"
            data-daily-status={false}
          >
            <div
              data-color-not-qualified={true}
              className="management-dashboard-modal-daily-status-color"
            ></div>
            <span>{fileLanguage[chooseLanguage].not_qualified}</span>
          </div>
          <div
            className="management-dashboard-modal-daily-status"
            data-daily-status={true}
          >
            <div
              data-color-images-not-good={true}
              className="management-dashboard-modal-daily-status-color"
            ></div>
            <span>{fileLanguage[chooseLanguage].images_not_good}</span>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

ModalDaily.propTypes = {
  isOpenModalDailyLC: PropTypes.bool,
  handleClickOpenModalDailyLC: PropTypes.func,
  isValueDailyNotqualified: PropTypes.array,
  isValueDailyNG: PropTypes.array,
  isValueDailyAll: PropTypes.array,
  handleDatePickerModalDaily: PropTypes.func,
  datePickerValue: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ModalDaily;
