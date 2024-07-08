import { JSONObject } from '@/lib/definations';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import * as ReportService from "@/lib/services/reportService";
import * as Constant from "@/lib/constants";
import * as Utils from "@/lib/utils";


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
		let remainingDescript = "";
		
		for (var i = 0; i < payload.length; i++) {
			if (payload[i].dataKey == "totalIncome") {
				incomeDscrp = `Income: ${payload[i].payload.totalIncome}$`;
			}
			else if (payload[i].dataKey == "totalExpense") {
				expenseDescript = `Expense: ${payload[i].payload.totalExpense}$`;
			}
			else if (payload[i].dataKey == "remainingAmount") {
				remainingDescript = `Remaining: ${payload[i].payload.remainingAmount.toFixed(2)}$`;
			}
		}

		return (
			<div className="custom-tooltip bg-white p-3 border border-gray-300">
				<p className="label">{`${label}`}</p>
				{/* <p className="intro">{getIntroOfArea(label)}</p> */}
				<p className="desc text-green-600">{`${incomeDscrp}`}</p>
				<p className="desc text-red-600">{`${expenseDescript}`}</p>
				<p className="desc text-purple-600">{`${remainingDescript}`}</p>
			</div>
		);
	}

	return null;
};

export default function IncomeVsExpenseTrendChart({ data, periodType, startDate, endDate }) {


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
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
				resultItem["remainingAmount"] = found[0].totalIncome - found[0].totalExpense;
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
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
				resultItem["remainingAmount"] = found[0].totalIncome - found[0].totalExpense;
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
				resultItem["totalIncome"] = found[0].totalIncome;
				resultItem["totalExpense"] = found[0].totalExpense;
				resultItem["remainingAmount"] = ( found[0].totalIncome - found[0].totalExpense );
			}

			result.push(resultItem);
		}

		return result;
	}

	const transformedReportData = transformData();


	return (
		<ResponsiveContainer width="100%" height={500}>
			<LineChart
				width={500}
				height={400}
				data={transformedReportData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 35,
				}}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="name"
					interval={0}
					angle={-35}
					textAnchor="end"
					tick={{ fontSize: 12 }}
				/>
				<YAxis />
				<Tooltip content={<CustomTooltip />} />
				{/* <Legend /> */}
				<Line type="monotone" dataKey="totalIncome" stroke={ReportService.incomeColors[0]} strokeWidth={2} activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="totalExpense" stroke={ReportService.expenseColors[0]} strokeWidth={2} activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="remainingAmount" stroke={ReportService.COLORS[4]} strokeWidth={2} activeDot={{ r: 8 }} />

			</LineChart>

		</ResponsiveContainer>
	);

};