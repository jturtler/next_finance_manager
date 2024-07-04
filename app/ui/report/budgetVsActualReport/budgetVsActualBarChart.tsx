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


export default function BudgetVsActualBarChart({ data }: { data: JSONObject }) {
	
	const reportData = data.data;


	return (
		// <div className="w-full h-full">
		<ResponsiveContainer width="100%" height={400}>
		<BarChart
			// width={1500}
			// height={400}
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
				dataKey="_id.categoryName" 
				interval={0}
				angle={-45}
				textAnchor="end"
				tick={{ fontSize: 12 }}
			/>
			<YAxis />
			<Tooltip />
			<Legend wrapperStyle={{paddingTop: "60px"}} />
			<Bar dataKey="budgetAmount" name="Budget" fill={ReportService.budgetColors[0]} />
			<Bar dataKey="expenseAmount" name="Expense" fill={ReportService.expenseColors[0]} />
			</BarChart>
		</ResponsiveContainer>
		// </div>
	);
}
