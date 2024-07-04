import { JSONObject } from "@/lib/definations";
import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import * as ReportService from "@/lib/services/reportService";
import * as Utils from "@/lib/utils";

export default function AnnualStackedBarChart({ data, categoryList }: { data: JSONObject, categoryList: JSONObject[]}) {
	let valueColdsName = (data.length > 0) ? Object.keys(data[0]) : [];
	valueColdsName = valueColdsName.filter(item => item !== "name");

    let reportData: JSONObject[] = Utils.mergeArrays(data);
    console.log(reportData);
	return (
		<ResponsiveContainer width="100%" height={800}>
            <BarChart
                data={reportData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                />
                <YAxis />
                {/* <Tooltip shared={false} trigger="click" /> */}
                <Tooltip />
                <Legend wrapperStyle={{paddingTop: "60px"}} />
                {Object.keys(reportData[0])
                    .filter((key) => key !== "year")
                    .map((key, index) => (
                        <Bar
                        key={key}
                        dataKey={key}
                        stackId={key.startsWith("income_") ? "income" : "expense"}
                        fill={
                            key.startsWith("income_")
                            ? ReportService.COLORS[index % ReportService.COLORS.length]
                            : ReportService.COLORS[index % ReportService.COLORS.length]
                        }
                        />
                    ))}
            </BarChart>
		</ResponsiveContainer>
	);
}
