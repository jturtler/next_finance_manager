import { JSONObject } from "@/lib/definations";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import * as ReportService from "@/lib/services/reportService";
import { useEffect } from "react";


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function CustomPieChart({ expenseData, incomeData, budgetData, requestToUpdate = 0 }: { expenseData: JSONObject[] | undefined, incomeData: JSONObject[] | undefined, budgetData: JSONObject[] | undefined, requestToUpdate: number }) {

    useEffect(() => {
        console.log("Rending pie chart again");
    }, [requestToUpdate]);


    return (
        <ResponsiveContainer width={1000} height={400}>
            <PieChart width={1000} height={400}>
                {incomeData !== undefined &&
                    <Pie
                        data={incomeData}
                        dataKey="totalAmount"
                        cx="50%" cy="50%" 
                        outerRadius={60}
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomizedLabel}
                    >
                    </Pie>}


                {budgetData !== undefined &&
                    <Pie
                        data={budgetData}
                        dataKey="totalAmount"
                        cx="50%" cy="50%" 
                        innerRadius={70}
                        outerRadius={95}
                        fill="#82ca9d"
                        label={(expenseData === undefined) ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                    >
                        {/* {budgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ReportService.COLORS[index % ReportService.COLORS.length]}>
                            </Cell>
                        ))} */}

                    </Pie>
                }

                {expenseData !== undefined &&
                    <Pie
                        // isAnimationActive={false}
                        data={expenseData}
                        dataKey="totalAmount"
                        cx="50%" cy="50%" 
                        innerRadius={110}
                        outerRadius={135}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        fill="#ffc658" >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ReportService.COLORS[index % ReportService.COLORS.length]}>
                            </Cell>
                        ))}
                    </Pie>}


                <Tooltip />

                {/* <Legend
                    // layout="vertical"
                    // align="right"
                    // verticalAlign="top"
                    wrapperStyle={{ paddingLeft: '100px', paddingRight: '5px' }}
                /> */}

            {/* <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry) => {
                    const dataSetIndex = entry.payload?.dataIndex;
                    const pieIndex = entry.payload?.pieIndex;
                    return `${value} (${
                    dataSetIndex !== undefined ? dataSetIndex : ""
                    }) ${pieIndex !== undefined ? pieIndex : ""}`;
                }}
            /> */}

            </PieChart>
        </ResponsiveContainer>
    )
}