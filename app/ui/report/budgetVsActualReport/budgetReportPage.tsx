import React from 'react';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import { useCategory } from '@/contexts/CategoryContext';
import BudgetVsActualBarChart from './budgetVsActualBarChart';
import BudgetVsActualProcessBar from './budgetVsActualProcessBar';

export default function BudgetReportPage({ data, periodType, startDate, endDate }) {

	const reportDataList = data.data;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Budget vs Actual</h1>
			
			<div className="bg-white shadow-md rounded-lg p-4 mb-6">
				<h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
				<BudgetVsActualProcessBar data={data} />
			</div>

			<div className="bg-white shadow-md rounded-lg p-4 mb-6">
				<h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
				<BudgetVsActualBarChart data={data} />
			</div>
			

			<div className="bg-white shadow-md rounded-lg p-4">
				<h2 className="text-xl font-semibold mb-4">Details</h2>
				<table className="min-w-full bg-white">
					<thead>
						<tr>
							<th className="px-4 py-2 bg-slate-600 text-white text-left">Category</th>
							<th className="px-4 py-2 bg-slate-600 text-white text-left">Budget</th>
							<th className="px-4 py-2 bg-slate-600 text-white text-left">Expense</th>
							<th className="px-4 py-2 bg-slate-600 text-white text-left">Remain</th>
						</tr>
					</thead>
					<tbody>
						{reportDataList.map((reportData, rIdx) => {
							return (<React.Fragment key={rIdx}>
								<tr key={rIdx} className="text-green-600 bg-slate-100 hover:bg-slate-300">
									<td className="border px-4 py-2">{reportData._id.categoryName}$</td>
									<td className="border px-4 py-2 text-blue-600">{reportData.budgetAmount}$</td>
									<td className="border px-4 py-2 text-red-600">{reportData.expenseAmount}$</td>
									<td className="border px-4 py-2 text-teal-600">{reportData.remainingAmount}$</td>
								</tr>
							</React.Fragment>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
