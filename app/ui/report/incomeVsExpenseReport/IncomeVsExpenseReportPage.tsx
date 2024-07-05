import React from 'react';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import IncomeVsExpenseBarChart from './IncomeVsExpenseBarChart';
import { useCategory } from '@/contexts/CategoryContext';
import IncomeVsExpenseAreaChart from './IncomeVsExpenseAreaChart';
import * as Constant from "@/lib/constants";
import IncomeVsExpenseReportDetails from './IncomeVsExpenseReportDetails';

export default function IncomeVsExpenseReportPage({ data, periodType, startDate, endDate }) {

	const compareDates = (a, b) => {
		// Extract year and quarter from both objects
		const yearA = a.date.year;
		const monthA = a.date.month;
		const quarterA = a.date.quarter;

		const yearB = b.date.year;
		const monthB = b.date.month;
		const quarterB = b.date.quarter;
	  
		// Compare years first
		if (yearA !== yearB) {
		  return yearA - yearB; // Sort by year ascending
		} else if( quarterA !== undefined ) {
		  return quarterA - quarterB; // If years are equal, sort by quarter ascending
		} else if( monthA !== undefined ) {
			return monthA - monthB; // If years are equal, sort by quarter ascending
		  }
	};

	const reportDataList = (data.data).slice().sort(compareDates);
	const { expenseList, incomeList }  = useCategory();


	return (
		<div className="mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Income vs Expense Report</h1>

			<div className="grid grid-cols-2">
				<div className="bg-white shadow-md rounded-lg p-4 mb-6">
					<h2 className="text-xl font-semibold mb-4">Income vs Expense - Area Chart</h2>
					<IncomeVsExpenseAreaChart data={reportDataList} startDate={startDate} endDate={endDate} periodType={periodType} />
				</div>

				<div className="bg-white shadow-md rounded-lg p-4 mb-6">
					<h2 className="text-xl font-semibold mb-4">Income vs Expense - Stacked Bar Chart</h2>
					<IncomeVsExpenseBarChart data={reportDataList} startDate={startDate} endDate={endDate} periodType={periodType} categoryExpenseList={expenseList}
						categoryIncomeList={incomeList} />
				</div>

			</div>

			<div className="bg-white shadow-md rounded-lg p-4">
				<IncomeVsExpenseReportDetails data={reportDataList} />
			</div>
		</div>
	);
};
