import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: false,
      text: 'Job Vacancy',
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide vertical grid lines
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Job Vacancy',
      data: [5, 6, 7],
      backgroundColor: '#9ABDDC',
      barThickness: 20,
      borderRadius: {
        topLeft: 4,
        topRight: 4,
      },
    },
  ],
};

const JobVacancyChart = () => {
  return (
    <div className="bg-white rounded-[20px] p-4">
      <h3 className="text-blackText font-semibold mb-5">Job Vacancy</h3>

      <Bar options={options} data={data} />
    </div>
  );
};

export default JobVacancyChart;
