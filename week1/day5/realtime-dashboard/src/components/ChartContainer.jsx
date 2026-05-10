import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function ChartContainer({
  data,
  selectedMetric,
  onMetricChange
}) {
  const revenueChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const ordersChartRef = useRef(null);

  const revenueInstance = useRef(null);
  const usersInstance = useRef(null);
  const ordersInstance = useRef(null);

  useEffect(() => {
    // Revenue Chart
    if (revenueChartRef.current) {
      revenueInstance.current = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Revenue',
              data: [120, 190, 300, 250, 400],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    }

    // Users Chart
    if (usersChartRef.current) {
      usersInstance.current = new Chart(usersChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              label: 'Users',
              data: [30, 45, 60, 40, 90],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    }

    // Orders Chart
    if (ordersChartRef.current) {
      ordersInstance.current = new Chart(ordersChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Completed', 'Cancelled'],
          datasets: [
            {
              label: 'Orders',
              data: [12, 55, 8],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    }

    return () => {
      revenueInstance.current?.destroy();
      usersInstance.current?.destroy();
      ordersInstance.current?.destroy();
    };
  }, [data]);

  return (
    <div className="charts-wrapper">
      <div className="chart-header">
        <h2>Analytics Dashboard</h2>

        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value)}
        >
          <option value="revenue">Revenue</option>
          <option value="users">Users</option>
          <option value="orders">Orders</option>
        </select>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <canvas ref={revenueChartRef}></canvas>
        </div>

        <div className="chart-card">
          <h3>User Growth</h3>
          <canvas ref={usersChartRef}></canvas>
        </div>

        <div className="chart-card">
          <h3>Orders Distribution</h3>
          <canvas ref={ordersChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}