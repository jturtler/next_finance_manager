import { JSONObject } from "@/lib/definations";
import * as Utils from '@/lib/utils';
import * as Constant from "@/lib/constants";


// export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// export const COLORS = ['#4CAF50', '#F44336', '#2196F3', '#9E9E9E'];

export const COLORS = [
	"#1F77B4", // Strong Blue
	"#FF7F0E", // Strong Orange
	"#2CA02C", // Strong Green
	"#D62728", // Strong Red
	"#9467BD", // Strong Purple
	"#8C564B", // Strong Brown
	"#E377C2", // Strong Pink
	"#7F7F7F", // Strong Grey
	"#BCBD22", // Strong Yellow-Green
	"#17BECF", // Strong Cyan
	"#FFBB78", // Light Orange
	"#98DF8A", // Light Green
	"#FF9896", // Light Red
	"#C5B0D5", // Light Purple
	"#C49C94", // Light Brown
	"#F7B6D2", // Light Pink
	"#C7C7C7", // Light Grey
	"#DBDB8D", // Light Yellow-Green
	"#9EDAE5", // Light Cyan
	"#1F78B4", // Deep Blue
	"#33A02C", // Deep Green
	"#FB9A99", // Soft Red
	"#E31A1C", // Deep Red
	"#FDBF6F", // Deep Orange
	"#FF7F00", // Bright Orange
	"#CAB2D6", // Soft Purple
	"#6A3D9A", // Deep Purple
	"#B15928", // Deep Brown
	"#FFFF99", // Bright Yellow
	"#B2DF8A"  // Soft Green
];

export const incomeColors = [
	"#A8E6CF", "#98FB98", "#90EE90", "#8FBC8F", "#66CDAA", "#3CB371",
	"#2E8B57", "#20B2AA", "#008080", "#006400", "#32CD32", "#228B22",
	"#00FA9A", "#7CFC00", "#00FF7F"
];

export const expenseColors = [
	"#FFB6C1", "#FFA07A", "#FA8072", "#E9967A", "#F08080", "#CD5C5C",
	"#DC143C", "#FF6347", "#FF4500", "#B22222", "#FF0000", "#8B0000",
	"#FF7F7F", "#FF6F61", "#D32F2F"
];

export const budgetColors = [
	"#87CEFA", "#00BFFF", "#1E90FF", "#6495ED", "#4169E1", "#0000CD",
	"#00008B", "#000080", "#4682B4", "#6A5ACD", "#87CEEB", "#F0F8FF",
	"#B0E0E6", "#ADD8E6", "#008080"
];

export const retrieveAggregateData = async (path: string, payload: JSONObject): Promise<JSONObject> => {

	try {
		const response = await fetch(`api/report/${path}`, {
			method: "POST",
			headers: {
				"Content-type": "appliction/json"
			},
			body: JSON.stringify(payload)
		})

		if (!response.ok) {
			return ({ errMsg: "Network response was not ok" });
		}
		else {
			var jsonResponse: JSONObject = await response.json();
			if (jsonResponse.errMsg == undefined) { // run successfully.
				return jsonResponse;
			}
			else { // fail
				return jsonResponse.errMsg;
			}
		}
	}
	catch (err) {
		return ({ errMsg: Utils.getErrMessage(err) });
	}

}

export const generateColor = (num: number) => {
	const r = Math.floor(Math.sin(num) * 128 + 128);
	const g = Math.floor(Math.sin(num + 2) * 128 + 128);
	const b = Math.floor(Math.sin(num + 4) * 128 + 128);
	return `rgb(${r}, ${g}, ${b})`;
}

export const transformReportData_IncomeVSExpense = (data: JSONObject, startDate: Date, endDate: Date): JSONObject[] => {
	var transformedData: JSONObject[] = [];
	const incomeData = data.incomeData;
	const expenseData = data.expenseData;

	const monthList = Utils.generateMonthList(startDate, endDate);

	for (var i = 0; i < monthList.length; i++) {
		const monthInfo = monthList[i];
		const income = incomeData.filter((item) => (item.month === monthInfo.month && item.year === monthInfo.year));
		const expense = expenseData.filter((item) => (item.month === monthInfo.month && item.year === monthInfo.year));

		const incomeVal = (income === undefined || income.length == 0) ? 0 : income[0].totalAmount;
		const expenseVal = (expense === undefined || expense.length == 0) ? 0 : expense[0].totalAmount;
		transformedData.push({
			name: monthInfo.displayName,
			Income: incomeVal,
			Expense: expenseVal
		})
	}

	return transformedData;
}


export const transformReportData_BudgetVSActual = (reportData: JSONObject): JSONObject[] => {
	var transformedData: JSONObject[] = [];
	var data = reportData.data;

	for (var i = 0; i < data.length; i++) {
		const item = data[i];

		transformedData.push({
			name: item.categoryName,
			Budget: item.budgetAmount,
			Expense: item.expenseAmount,
			// remainingAmount: item.remainingAmount
		})
	}

	return transformedData;
}


export const transformReportData_CategoryMonthly = (reportData: JSONObject, startDate: Date, endDate: Date): JSONObject => {
	var transformedData: JSONObject[] = [];

	// Add empty items if missing and conver the "name" of items to readable names of months
	const monthList = Utils.generateMonthList(startDate, endDate);
	const data = reportData.data;

	for (var i = 0; i < monthList.length; i++) {
		const monthInfo = monthList[i];
		const itemList = data.filter((item) => (item.month === monthInfo.month && item.year === monthInfo.year));

		const totals = (itemList === undefined || itemList.length == 0) ? 0 : itemList[0].totals;

		transformedData.push({
			name: monthInfo.displayName,
			...totals
		})
	}

	console.log(transformedData);
	return transformedData;
}



export const transformReportData_AnnualFinancialSummary = (reportData: JSONObject): JSONObject => {
	return reportData.data.map((item) => {
		const transformed = { year: item.year };
		Object.keys(item.income).forEach((key) => {
			transformed[`income_${key}`] = item.income[key];
		});
		Object.keys(item.expense).forEach((key) => {
			transformed[`expense_${key}`] = item.expense[key];
		});
		return transformed;
	});
}

export const generateRedColor = (index: number): string => {
	const maxIndex = 255; // Maximum value for green and blue components
	const variation = index % maxIndex;

	// Create a color in the form of 'rgb(255, <variation>, <variation>)'
	// const color = `rgb(255, ${variation}, ${variation})`;
	const color = `rgb(${variation}, 0, 0)`;

	return color;
}

export const generateGreenColor = (index: number): string => {
	const maxIndex = 255; // Maximum value for green component
	const variation = index % maxIndex;

	// Create a color in the form of 'rgb(<variation>, 255, <variation>)'
	const color = `rgb(${variation}, 255, ${variation})`;

	return color;
}


export const generateBlueColor = (index: number): string => {
	const maxIndex = 255; // Maximum value for blue component
	const variation = index % maxIndex;

	// Create a color in the form of 'rgb(0, 0, <variation>)'
	const color = `rgb(0, 0, ${variation})`;

	return color;
}