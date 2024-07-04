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
import * as Constant from "@/lib/constants";
import * as Utils from "@/lib/utils";


// data = [
// {
// 	"totalIncome": 0,
// 	"totalExpense": 343,
// 	"date": {
// 		"year": 2023,
// 		"month": 5,  //"quarter": 3 // undefined
// 	},
// 	"expense": {
// 		"Insurance": 250,
// 		"Transportation": 23,
// 		"Entertainment": 70
// 	}
// }
// ...
// ]
export default function CategoryWiseExpenseBarChart({ data, periodType, startDate, endDate, categoryExpenseList }) {
	
	// [
	// 	{name: "2004-1", "income_Salary": 3000, "expense_Housing": 400 },
	// 	...
	// ]
	const transformData = (): JSONObject[] => {

		if (periodType == Constant.REPORT_PERIOD_TYPE_MONTHLY) {
			return transformData_Monthly(startDate, endDate);
		}
		else if (periodType == Constant.REPORT_PERIOD_TYPE_QUARTERLY) {
			return transformData_Quarterly(startDate, endDate);
		}
		else if (periodType == Constant.REPORT_PERIOD_TYPE_YEARLY) {
			return transformData_Yearly(startDate, endDate);
		}

		return [];
	}

	const transformData_Monthly = (startDate, endDate): JSONObject[] => {

		let result: JSONObject[] = [];

		const monthList = Utils.generateMonthList(startDate, endDate);
		for (var i = 0; i < monthList.length; i++) {
			const monthInfo = monthList[i];

			const found = data.filter((item) => (item.date.month === monthInfo.month && item.date.year === monthInfo.year));

			let resultItem = { name: monthInfo.displayName };
			if (found.length > 0) {
				
				if (found[0].expense !== undefined) {
					Object.keys(found[0].expense).forEach((key) => {
						resultItem[key] = found[0].expense[key];
					});
				}
			}

			result.push(resultItem);
		}

		return result;
	}

	const transformData_Quarterly = (startDate, endDate): JSONObject[] => {
		let result: JSONObject[] = [];

		const quarterList = Utils.generateQuarterList(startDate, endDate);
		for (var i = 0; i < quarterList.length; i++) {
			const quarterInfo = quarterList[i];
			const found = data.filter((item) => (item.date.year === quarterInfo.year && item.date.quarter === quarterInfo.quarter));

			let resultItem = { name: quarterInfo.displayName };
			if (found.length > 0) {
				if (found[0].expense !== undefined) {
					Object.keys(found[0].expense).forEach((key) => {
						resultItem[key] = found[0].expense[key];
					});
				}
			}

			result.push(resultItem);
		}
		return result;
	}

	const transformData_Yearly = (startDate, endDate): JSONObject[] => {
		let result: JSONObject[] = [];

		const yearList = Utils.generateYearList(startDate, endDate);
		for (var i = 0; i < yearList.length; i++) {
			const yearInfo = yearList[i];
			const found = data.filter((item) => (item.date.year === yearInfo.dataKey));

			let resultItem = { name: yearInfo.displayName };
			if (found.length > 0) {
				if (found[0].expense !== undefined) {
					Object.keys(found[0].expense).forEach((key) => {
						resultItem[key] = found[0].expense[key];
					});
				}
			}

			result.push(resultItem);
		}

		return result;
	}

	const transformedReportData = transformData();
console.log(transformedReportData);

	return (
		<ResponsiveContainer width="100%" height={500}>
			<BarChart
				data={transformedReportData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 35,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="name"
					interval={0}
					angle={-35}
					textAnchor="end"
					tick={{ fontSize: 12 }}
				/>
				<YAxis />
				<Tooltip />

				{categoryExpenseList.map((category, index) => (
					<Bar key={category.name} dataKey={category.name} stackId="expense" fill={ReportService.expenseColors[index]} />
				))}
			</BarChart>
		</ResponsiveContainer>
	);
}
