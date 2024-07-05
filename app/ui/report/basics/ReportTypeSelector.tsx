import * as Constant from "@/lib/constants";

const reportTypes = [
	// *** Income vs. Expense Report
	// Description: Compare total income and total expenses over a specified period.
	// Period: Monthly, Quarterly, Yearly
	// Display: Bar chart, Stacked bar chart

	Constant.REPORT_TYPE_INCOME_VS_EXPENSE, // Compare income and expenses over a period ( Bar Chart and Line Chart) weekly, monthly, yearly 
	
	Constant.REPORT_TYPE_BUDGET_VS_ACTUAL, // Compare budgeted amounts with actual spending ( Bar Chart and Line Chart) 
	
	// *** Category-wise Expense Report
	// Description: Breakdown of expenses by categories (e.g., food, transportation, entertainment).
	// Period: Monthly, Quarterly, Yearly
	// Display: Pie chart, Donut chart, Bar chart
	Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE, // Details expenses by category. ( Bar Chart and Pie Chart), Typically monthly or annually.
	//   'Comparison Report',
	//   'Trend Report',
];

const ReportTypeSelector = ({ label, id, selectedReportType, onReportTypeChange }) => {
	return (
		<div>
			<label className="block text-gray-700 mb-2 text-sm" htmlFor={id}>{label}</label>
			<select
				id={id}
				value={selectedReportType}
				onChange={e => onReportTypeChange(e.target.value)}
				className="w-full p-2 border border-gray-300 rounded"
			>
				
				<option value="">[Please select]</option>
				{reportTypes.map((type, index) => (
					<option key={index} value={type}>
						{type}
					</option>
				))}
			</select>
		</div>
	);
};

export default ReportTypeSelector;
