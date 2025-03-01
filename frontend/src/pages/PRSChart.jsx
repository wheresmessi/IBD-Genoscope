import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PRSChart = ({ prsScore }) => {
  // Determine the risk level and color based on the PRS score
  let riskCategory = "Low";
  let backgroundColor = "rgba(40, 167, 69, 0.7)"; // Green for Low

  if (prsScore > 0.7) {
    riskCategory = "High";
    backgroundColor = "rgba(220, 53, 69, 0.7)"; // Red for High
  } else if (prsScore > 0.4) {
    riskCategory = "Moderate";
    backgroundColor = "rgba(255, 193, 7, 0.7)"; // Yellow for Moderate
  }

  // Chart Data
  const data = {
    labels: ["PRS Score"],
    datasets: [
      {
        label: `Risk Level: ${riskCategory}`,
        data: [prsScore],
        backgroundColor: backgroundColor,
        borderColor: backgroundColor.replace("0.7", "1"), // Darker border color
        borderWidth: 2,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div style={{ width: "400px", margin: "20px auto", textAlign: "center" }}>
      <h3>Polygenic Risk Score (PRS) Visualization</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PRSChart;
