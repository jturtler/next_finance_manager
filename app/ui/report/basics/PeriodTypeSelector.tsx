import * as Constant from "@/lib/constants";

const reportTypes = [
	Constant.REPORT_TYPE_INCOME_VS_EXPENSE, // Compare income and expenses over a period ( Bar Chart and Line Chart) weekly, monthly, yearly 
	Constant.REPORT_TYPE_BUDGET_VS_ACTUAL, // Compare budgeted amounts with actual spending ( Bar Chart and Line Chart) 
	Constant.REPORT_TYPE_MONTHLY_EXPENSE, // Summarizes expenses for each month ( Bar Chart and Pie Chart), Month-to-month comparison. --> ( choose a year )
	Constant.REPORT_TYPE_ANNUAL_FINANCIAL_SUMMARY, // Provides a yearly overview of income, expenses, and savings ( Area Chart, Stacked Bar Chart - broken down by category ), Annual (full year).
	Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE, // Details expenses by category. ( Bar Chart and Pie Chart), Typically monthly or annually.
	//   'Comparison Report',
	//   'Trend Report',
];

const PeriodTypeSelector = ({ label, id,  selectedPeriodType, onPeriodTypeChange }) => {
	return (
		<div>
			<label className="block text-gray-700 mb-2 text-sm" htmlFor={id}>{label}</label>
			<select
				id={id}
				value={selectedPeriodType}
				onChange={e => onPeriodTypeChange(e.target.value)}
				className="w-full p-2 border border-gray-300 rounded"
			>
                <option value="">[Please select]</option>
                <option value={Constant.REPORT_PERIOD_TYPE_MONTHLY}>{Constant.REPORT_PERIOD_TYPE_MONTHLY}</option>
                <option value={Constant.REPORT_PERIOD_TYPE_QUARTERLY}>{Constant.REPORT_PERIOD_TYPE_QUARTERLY}</option>
                <option value={Constant.REPORT_PERIOD_TYPE_YEARLY}>{Constant.REPORT_PERIOD_TYPE_YEARLY}</option>
			</select>
		</div>
	);
};

export default PeriodTypeSelector;
