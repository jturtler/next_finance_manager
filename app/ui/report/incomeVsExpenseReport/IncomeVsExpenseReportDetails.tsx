import React from 'react';

export default function IncomeVsExpenseReportDetails({ data }) {

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

	const reportDataList = (data).slice().sort(compareDates);

	return (
		<div className="bg-white shadow-md rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="px-4 py-2 bg-slate-600 text-white text-left">Category</th>
						<th className="px-4 py-2 bg-slate-600 text-white text-left">Amount</th>
					</tr>
				</thead>
				<tbody>
					{reportDataList.map((reportData, rIdx) => {
						return (<React.Fragment key={rIdx}>
							
							<tr>
								<th colSpan={2} className="bg-slate-400 px-4 py-2  text-left">Period: {reportData.date.month && reportData.date.month.toString().padStart(2, '0')} {reportData.date.quarter && <span>Q{reportData.date.quarter}</span>} {reportData.date.year}</th>
							</tr>
							<tr>
								<th colSpan={2} className="bg-slate-300 px-4 py-2 text-left text-green-600">Total Income:  {reportData.totalIncome}$</th>
							</tr>
							<tr>
								<th colSpan={2} className="bg-slate-300 px-4 py-2 text-left text-red-600">Total Expense:  {reportData.totalExpense}$</th>
							</tr>

							{/* Income  */}
							{(reportData.income == undefined) ? "" : Object.keys(reportData.income).map((categoryName: string, index: number) => {
								return (
									<tr key={index} className="text-green-600 bg-slate-100 hover:bg-slate-300">
										<td className="border px-4 py-2">Income -{categoryName}</td>
										<td className="border px-4 py-2">{reportData.income[categoryName]}$</td>
									</tr>
								);
							})}

							{/* Expense  */}
							{(reportData.expense == undefined) ? "" : Object.keys(reportData.expense).map((categoryName: string, index: number) => {
								return (
									<tr key={index} className="text-red-600 bg-slate-100 hover:bg-slate-300">
										<td className="border px-4 py-2">Expense - {categoryName}</td>
										<td className="border px-4 py-2">{reportData.expense[categoryName]}$</td>
									</tr>
								);
							})}
						</React.Fragment>
						)
					})}
				</tbody>
			</table>
		</div>
	);
};
