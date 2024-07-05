import { JSONObject } from "@/lib/definations";
import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
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

const getIntroOfArea = (label) => {

	// if (label === "Jun 2004") {
	//   return "Income";
	// }
	// else if (label === "Jul 2004") {
	//   return "Expense";
	// }
	return label;
  };

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		let incomeDscrp = "";
		let expenseDescript = "";
		for( var i=0; i<payload.length; i++ ) {
			if(payload[i].dataKey == "totalIncome") {
				incomeDscrp = `Income: ${payload[i].payload.totalIncome}$`;
			}
			else if(payload[i].dataKey == "totalExpense") {
				expenseDescript = `Expense: ${payload[i].payload.totalExpense}$`;
			}
		}

		return (
			<div className="custom-tooltip bg-white p-3 border border-gray-300">
			<p className="label">{`${label}`}</p>
			{/* <p className="intro">{getIntroOfArea(label)}</p> */}
			<p className="desc text-green-600">{`${incomeDscrp}`}</p>
			<p className="desc text-red-600">{`${expenseDescript}`}</p>
			</div>
		);
	}
  
	return null;
  };

export default function IncomeVsExpenseAreaChart({ data, periodType, startDate, endDate }) {

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

			let resultItem = { name: monthInfo.displayName, totalIncome: 0, totalExpense: 0 };
			if (found.length > 0) {
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
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

			let resultItem = { name: quarterInfo.displayName, totalIncome: 0, totalExpense: 0 };
			if (found.length > 0) {
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
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

			let resultItem = { name: yearInfo.displayName, totalIncome: 0, totalExpense: 0 };
			if (found.length > 0) {
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
			}

			result.push(resultItem);
		}

		return result;
	}
	
	const transformedReportData = transformData();
	

	return (
		<ResponsiveContainer width="100%" height={500}>
			<AreaChart
				width={500}
				height={400}
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
				<Tooltip content={<CustomTooltip />}/>
				<Area
					type="monotone"
					dataKey="totalIncome"
					stackId="1"
					stroke="#8884d8"
					fill={ReportService.incomeColors[0]} 
				/>
				<Area
					type="monotone"
					dataKey="totalExpense"
					stackId="2"
					stroke="#82ca9d"
					fill={ReportService.expenseColors[0]} 
				/>

				
			</AreaChart>
		</ResponsiveContainer>
	);
}
