import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { Select } from 'antd';
import { Button } from'react-bootstrap'
import 'antd/dist/reset.css'; // Import Ant Design styles

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MostSoldProductsChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
    const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

    useEffect(() => {
        fetchData();
    }, [selectedYear, selectedMonth]);

    const fetchData = async () => {
        try {
            const response = await axiosAdmin.post('/api/getmostsoldproducts', {
                year: selectedYear,
                month: selectedMonth
            });
            const data = response.data;

            if (Array.isArray(data) && data.length > 0) {
                const labels = data.map(item => item.tenSanPham || 'Unknown');
                const quantities = data.map(item => item.totalQuantitySold || 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Số lượng bán',
                            data: quantities,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
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

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };
    const handleReset = () => {
        setSelectedYear(null);
        setSelectedMonth(null);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h2>Thống Kê Sản Phẩm Bán Nhiều Nhất</h2>

            <div style={{ marginBottom: '20px' }}>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ marginRight: '10px', width: 120 }}
                    placeholder="Chọn năm"
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

                <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    style={{ width: 120 }}
                    placeholder="Chọn tháng"
                >
                    {Array.from({ length: 12 }, (_, index) => (
                        <Select.Option key={index + 1} value={index + 1}>
                            {index + 1}
                        </Select.Option>
                    ))}
                </Select>
                <Button onClick={handleReset} style={{ marginLeft: '10px' }}>
                    Xóa bộ lọc
                </Button>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <Bar
                    data={chartData}
                    options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false, // Adjust chart size to fit container
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: 'Số lượng bán theo sản phẩm',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default MostSoldProductsChart;
