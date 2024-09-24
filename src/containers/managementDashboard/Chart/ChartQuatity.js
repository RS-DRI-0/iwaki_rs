import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";
import ChartDataLabels from "chartjs-plugin-datalabels";
import fileLanguage from "../../../language.json";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ChartQuatity = ({ isValueDashBoard, chooseLanguage }) => {
  const processingValue = parseInt(isValueDashBoard.stt_processing);
  const completeValue = parseInt(isValueDashBoard.stt_complete);
  const verifiedValue = parseInt(isValueDashBoard.stt_verified);

  // Calculate the sum of all values
  const totalValue = processingValue + completeValue + verifiedValue;
  const allValuesZero = totalValue === 0;

  const processingPercentage =
    totalValue === 0 ? 0 : Math.round((processingValue / totalValue) * 100);
  const completePercentage =
    totalValue === 0 ? 0 : Math.round((completeValue / totalValue) * 100);
  const verifiedPercentage =
    totalValue === 0 ? 0 : Math.round((verifiedValue / totalValue) * 100);

  const data = {
    labels: [
      fileLanguage[chooseLanguage].processing,
      fileLanguage[chooseLanguage].completed,
      fileLanguage[chooseLanguage].verified,
    ],
    datasets: [
      {
        data: [
          processingPercentage,
          completePercentage,
          verifiedPercentage,
          allValuesZero === true ? 100 : 0,
        ],
        backgroundColor: [
          "#626262",
          "#085FA0",
          "#577354",
          "rgb(121 121 121 / 34%)",
        ],
      },
    ],
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      if (chart.options?.plugins?.centerText?.display) {
        const { width, height, ctx } = chart;
        ctx.restore();
        const fontSize = (height / 220).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const text = `${parseInt(
          isValueDashBoard.total_checksheet === ""
            ? 0
            : isValueDashBoard.total_checksheet
        )} ${fileLanguage[chooseLanguage].checksheets}`;

        const lines = text.split(" ");
        const lineHeight = fontSize * 16;

        const textY = (height - lines.length * lineHeight) / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, textY + index * lineHeight);
        });

        ctx.save();
      }
    },
  };

  useEffect(() => {
    ChartJS.register(centerTextPlugin);

    return () => {
      ChartJS.unregister(centerTextPlugin);
    };
  }, [isValueDashBoard, chooseLanguage]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Tắt hiển thị tên và màu
      },
      centerText: {
        display: true, // Set to false to not display the center text
      },
      tooltip: {
        enabled: !allValuesZero, // Vô hiệu hóa tooltips
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw || 0;
            return `${value.toFixed(0)}%`; // Append % sign
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        formatter: (value) => {
          if (allValuesZero) return "";
          if (value > 0 && value >= 5) return `${value}%`;
          return "";
        },
        font: {
          weight: "bold",
        },
      },
    },
    centerText: true,
  };

  return <Doughnut data={data} options={options} style={{ float: "right" }} />;
};

ChartQuatity.propTypes = {
  isValueDashBoard: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ChartQuatity;
