import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { Select } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueByYearChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
    const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const fetchData = async () => {
        try {
            const response = await axiosAdmin.post('/api/getRevenueByYear', {
                year: selectedYear
            });
            const data = response.data;

            if (Array.isArray(data) && data.length > 0) {
                const months = Array.from({ length: 12 }, (_, i) => i + 1);
                const revenueByMonth = months.map(month => {
                    const monthData = data.find(item => item.month === month);
                    return monthData ? monthData.totalRevenue : 0;
                });

                setChartData({
                    labels: months.map(month => `Tháng ${month}`),
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: revenueByMonth,
                            fill: false,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1
                        }
                    ]
                });
            } else {
                console.error("API returned an empty array or undefined.");
                setChartData({
                    labels: [],
                    datasets: []
                });
            }
        } catch (error) {
            console.error("Error fetching data from the API", error);
            setChartData({
                labels: [],
                datasets: []
            });
        }
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h2>Thống Kê Doanh Thu</h2>

            <div style={{ marginBottom: '20px' }}>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120 }}
                >
                    {Array.from({ length: 10 }, (_, index) => {
                        const year = new Date().getFullYear() - index;
                        return (
                            <Select.Option key={year} value={year}>
                                {year}
                            </Select.Option>
                        );
                    })}
                </Select>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false, // Adjust chart size to fit container
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Doanh thu theo tháng',
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Tháng'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Doanh thu'
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default RevenueByYearChart;
