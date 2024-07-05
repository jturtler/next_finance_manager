import React from 'react';
import * as Constant from "@/lib/constants";
import { useCategory } from '@/contexts/CategoryContext';
import CategoryExpenseReportPage from '../caterogyWiseExpenseReport/CategoryWiseExpenseReportPage';
import IncomeVsExpenseReportPage from '../incomeVsExpenseReport/IncomeVsExpenseReportPage';
import BudgetReportPage from '../budgetVsActualReport/budgetReportPage';


const ReportDisplay = ({ reportType, data, periodType, startDate, endDate }) => {
	const { categoryList } = useCategory();

	return (
		<div className="mt-4">

			{reportType === Constant.REPORT_TYPE_INCOME_VS_EXPENSE && <>
				<IncomeVsExpenseReportPage data={data} startDate={startDate} endDate={endDate} periodType={periodType} />
			</>}
			{reportType === Constant.REPORT_TYPE_BUDGET_VS_ACTUAL && <>
				<BudgetReportPage data={data} startDate={startDate} endDate={endDate} periodType={periodType} />
			</>}
			{reportType === Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE && <>
				<CategoryExpenseReportPage data={data} startDate={startDate} endDate={endDate} periodType={periodType} />
			</>}

		</div>
	);
};

export default ReportDisplay;
