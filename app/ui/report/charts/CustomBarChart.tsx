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


export default function CustomBarChart({ data }: { data: JSONObject[] }) {
	let valueColdsName = (data.length > 0) ? Object.keys(data[0]) : [];
	valueColdsName = valueColdsName.filter(item => item !== "name");

	return (
		// <div className="w-full h-full">
		<ResponsiveContainer width="100%" height={400}>
		<BarChart
			// width={1500}
			// height={400}
			data={data}
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
			{valueColdsName.map((item, index) => (
				<Bar key={index} dataKey={item} fill={ReportService.generateColor(index)} />
			))}
		</BarChart>
		</ResponsiveContainer>
		// </div>
	);
}
