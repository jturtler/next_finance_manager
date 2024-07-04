import { JSONObject } from "@/lib/definations";
import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import * as ReportService from "@/lib/services/reportService";


export default function CustomLineChart({ data }: { data: JSONObject[] }) {
	let valueColdsName = (data.length > 0) ? Object.keys(data[0]) : [];
	valueColdsName = valueColdsName.filter(item => item !== "name");

	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
				<YAxis />
				<Tooltip />
				<Legend />
				{valueColdsName.map((item, index) => (
					<Line key={index} type="monotone" dataKey={item} stroke={ReportService.generateColor(index)} />
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}
