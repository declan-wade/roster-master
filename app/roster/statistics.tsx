import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {getObjectFromStorage} from "@/app/storageService";
import {useSearchParams} from "next/navigation";
import {DateTime} from "luxon";

// Importing Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registering Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Roster {
    [day: string]: {
        [shift: string]: string[];
    };
}


const ShiftStatistics= () => {
    const data: Roster | null = getObjectFromStorage("roster-cookie");
    const searchParams = useSearchParams();
    const params: any = searchParams.get("startDate");
    const startDate = DateTime.fromISO(params);
    const formattedDate = startDate.toFormat("EEEE dd LLLL yyyy");
    const week = 2
    const [weeklyData, setWeeklyData] = useState({});
    const [dailyData, setDailyData] = useState({});

    useEffect(() => {
        console.log(data)
        const tempWeeklyData = {};
        const tempDailyData = {};

        Object.entries(data as any).forEach(([date, shifts]) => {
            const dayOfWeek = new Date(date).toLocaleDateString('en-AU', { weekday: 'long' });

            Object.values(shifts as any).flat().forEach((person) => {
                if (!tempWeeklyData[person]) tempWeeklyData[person] = {};
                if (!tempWeeklyData[person][week]) tempWeeklyData[person][week] = 0;
                tempWeeklyData[person][week] += 1;

                if (!tempDailyData[person]) tempDailyData[person] = {};
                if (!tempDailyData[person][dayOfWeek]) tempDailyData[person][dayOfWeek] = 0;
                tempDailyData[person][dayOfWeek] += 1;
            });
        });

        setWeeklyData(tempWeeklyData);
        setDailyData(tempDailyData);
    }, []);

    const generateChartData = (data: any) => {
        // Check if data is empty
        if (Object.keys(data).length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const labels = Object.keys(data);
        const firstLabelData = data[labels[0]];

        // Check if the first label's data is defined and not null
        if (!firstLabelData) {
            return {
                labels: [],
                datasets: [],
            };
        }

        // If we've made it here, it's safe to assume the first label's data exists and is an object
        const chartLabels = Object.keys(firstLabelData);

        const datasets = labels.map((label) => {
            const personData = data[label] || {};
            const dataPoints = chartLabels.map((chartLabel) => personData[chartLabel] || 0);

            return {
                label,
                data: dataPoints,
                backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
            };
        });

        return {
            labels: chartLabels,
            datasets,
        };
    };

    return (
        <div>
            <h5>Weekly Shifts</h5>
            <Bar data={generateChartData(weeklyData)} />

            <h5>Daily Shifts</h5>
            <Bar data={generateChartData(dailyData)} />
        </div>
    );
};

export default ShiftStatistics;
