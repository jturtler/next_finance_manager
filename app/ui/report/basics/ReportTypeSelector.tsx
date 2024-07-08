import * as Constant from "@/lib/constants";

const reportTypes = [
	Constant.REPORT_TYPE_INCOME_VS_EXPENSE,
	Constant.REPORT_TYPE_BUDGET_VS_ACTUAL, 
	Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE,
	//   'Comparison Report',
	//   'Trend Report',
];

const ReportTypeSelector = ({ label, id, selectedReportType, onReportTypeChange }) => {
	return (
		<div>
			<label className="font-bold block text-gray-700 mb-2 text-sm" htmlFor={id}>{label}</label>
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
