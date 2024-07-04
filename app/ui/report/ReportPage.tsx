import React, { useState } from 'react';
import CustomDatePicker from './basics/DatePicker';
import CustomMonthPicker from './basics/MonthPicker';
import CustomYearPicker from './basics/YearPicker';
import ReportTypeSelector from './basics/ReportTypeSelector';
import ReportDisplay from './basics/ReportDisplay';
import { JSONObject } from '@/lib/definations';
import * as Constant from "@/lib/constants";
import * as ReportService from "@/lib/services/reportService";
import { useAuth } from '@/contexts/AuthContext';
import * as Utils from "@/lib/utils";
import { useCategory } from '@/contexts/CategoryContext';
import PeriodTypeSelector from './basics/PeriodTypeSelector';


export default function ReportPage() {

	const { user } = useAuth();
	const { categoryList } = useCategory();

	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(new Date());

	
	const [selectedReportType, setSelectedReportType] = useState(Constant.REPORT_TYPE_INCOME_VS_EXPENSE);
	const [chartData, setChartData] = useState<JSONObject | JSONObject[]>({});


	//   const [selectedDate, setSelectedDate] = useState(null);
	// const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedPeriodType, setSelectedPeriodType] = useState(Constant.REPORT_PERIOD_TYPE_MONTHLY);
	
	// const [startMonth, setStartMonth ] = useState<{ startDate: Date; endDate: Date }>({startDate: new Date(), endDate: new Date()});
	// const [endMonth, setEndMonth] = useState<{ startDate: Date; endDate: Date }>({startDate: new Date(), endDate: new Date()});

	// const [startYear, setStartYear ] = useState<Date | null>(null);
	// const [endYear, setEndYear] = useState<Date | null>(null);

	  const [selectedMonth, setSelectedMonth] = useState(new Date());
	//   const [selectedYear, setSelectedYear] = useState(null);


	const [requestToUpdate, setRequestToUpdate] = useState<number>(0);

	const handleUpdateChart = () => {
		let count = requestToUpdate + 1;
		setRequestToUpdate(count);
	}

	const generateReport = async () => {
		if( selectedReportType === Constant.REPORT_TYPE_INCOME_VS_EXPENSE ) {
			await generateIncomeVsReport();
		}
		else if( selectedReportType === Constant.REPORT_TYPE_BUDGET_VS_ACTUAL ) {
			await generateBudgetVsActutalReport();
		}
		else if( selectedReportType === Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE ) {
			await generateCategoryWiseExpenseReport();
		}
		

		else if( selectedReportType === Constant.REPORT_TYPE_MONTHLY_EXPENSE ) {
			await generateMonthlyExpenseReport();
		}
		else if( selectedReportType === Constant.REPORT_TYPE_ANNUAL_FINANCIAL_SUMMARY ) {
			await generateAnnualFinancialSummaryReport();
		}

	}

	const generateIncomeVsReport = async() => {
		const urlPath = "income-vs-expense";
		// let fromDate: Date | null = null; 
		// let toDate: Date | null = null; 
		// if( selectedPeriodType === Constant.REPORT_PERIOD_TYPE_MONTHLY ) {
		// 	fromDate = startMonth.startDate;
		// 	toDate = endMonth.endDate;
		// }
		// else if( selectedPeriodType === Constant.REPORT_PERIOD_TYPE_QUARTERLY ) {
		// 	fromDate = startMonth.startDate;
		// 	toDate = endMonth.endDate;
		// }
		// else if( selectedPeriodType === Constant.REPORT_PERIOD_TYPE_YEARLY ) {
		// 	fromDate = startYear;
		// 	toDate = endMonth.endDate;
		// }
		const payload = {
			userId: user!._id,
			startDate: startDate!.toISOString(), 
			endDate: endDate!.toISOString(),
			periodType: selectedPeriodType
		}

		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);

		if (tempChartData.errMsg === undefined) {
			// const dataTranformed = ReportService.transformReportData_IncomeVSExpense(tempChartData, startDate!, endDate!);
			// setChartData(dataTranformed);
			setChartData(tempChartData);
			handleUpdateChart();
		}
		else {
			// Show error message here
		}
	}

	const generateBudgetVsActutalReport = async() => {
		const urlPath = "budget-vs-actual"; 
		const payload = {
			userId: user!._id,
			startDate: startDate!.toISOString(), 
			endDate: endDate!.toISOString()
		}
		
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);

		if (tempChartData.errMsg === undefined) {
			// const dataTranformed = ReportService.transformReportData_BudgetVSActual( tempChartData );
			setChartData(tempChartData);
			handleUpdateChart();
		}
		else {
			// Show error message here
		}
	}

	const generateCategoryWiseExpenseReport = async() => {
		const urlPath = "income-vs-expense"; // Get expense only after this
		const payload = {
			userId: user!._id,
			startDate: startDate!.toISOString(), 
			endDate: endDate!.toISOString(),
			periodType: selectedPeriodType
		}
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);
		if (tempChartData.errMsg === undefined) {
			delete tempChartData.totalIncome;
			delete tempChartData.income;

			setChartData(tempChartData);
			handleUpdateChart();
		}
		else {
			// Show error message here
		}
	}



	const generateMonthlyExpenseReport = async() => {
		const urlPath = "category-monthly-report";
		const payload = {
			userId: user!._id,
			startDate: startDate!.toISOString(), 
			endDate: endDate!.toISOString(),
			dataFrom: "expense"
		}
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);

		if (tempChartData.errMsg === undefined) {
			const dataTranformed = ReportService.transformReportData_CategoryMonthly(tempChartData, startDate!, endDate!);
			setChartData(dataTranformed);
			handleUpdateChart();
		}
		else {
			// Show error message here
		}
	}

	const generateAnnualFinancialSummaryReport = async() => {
		const urlPath = "annual-financial-summary";
		const payload = {
			userId: user!._id,
			startDate: startDate!.toISOString(), 
			endDate: endDate!.toISOString()
		}
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);

		if (tempChartData.errMsg === undefined) {
			const dataTranformed = ReportService.transformReportData_AnnualFinancialSummary(tempChartData);
			setChartData(dataTranformed);
			handleUpdateChart();
		}
		else {
			// Show error message here
		}
	}

	return (

		<div className="container mx-auto p-4 min-h-[calc(100vh-100px)]">
			<h1 className="text-2xl font-bold mb-4">Reports</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<ReportTypeSelector
					label="Report Type"
					id="reportType"
					selectedReportType={selectedReportType}
					onReportTypeChange={(value) => {setChartData({}); setSelectedReportType(value)}} />

				{/* For date range */}
				<CustomDatePicker
					label="Start Date"
					id="startDate"
					selectedDate={startDate}
					onDateChange={(date: Date | null) => {setChartData({}); setStartDate(date)}}
				/>

				<CustomDatePicker
					label="End Date"
					id="endDate"
					selectedDate={endDate}
					onDateChange={(date: Date | null) => {setChartData({}); setEndDate(date)}}
				/>

				{(selectedReportType == Constant.REPORT_TYPE_INCOME_VS_EXPENSE 
					|| selectedReportType == Constant.REPORT_TYPE_CATEGORY_WISE_EXPENSE
				)
					&& <PeriodTypeSelector selectedPeriodType={selectedPeriodType}
					label="Period Type"
					id="periodType"
					onPeriodTypeChange={(value) => {setChartData({}); setSelectedPeriodType(value)}} /> }

				{/* For monthly period */}
				{/* {selectedPeriodType == Constant.REPORT_PERIOD_TYPE_MONTHLY && <>
					<CustomMonthPicker label="Select a Month"
						id="startMonth"
						selectedMonth={startMonth.startDate}
						onMonthChange={(dateRange) => {setChartData({}); setStartMonth(dateRange);}}
					/>
					<CustomMonthPicker label="Select a Month"
						id="endMonth"
						selectedMonth={endMonth.startDate}
						onMonthChange={(dateRange) => {setChartData({}); setEndMonth(dateRange);}}
					/>
				</>} */}

				{/* {selectedPeriodType == Constant.REPORT_PERIOD_TYPE_QUARTERLY && <>
					<CustomQuarterPicker 
					// label="Start Year"
						// id="startYear"
						selectedQuarter={startDate}
						onQuarterChange={(date: Date | null) => {console.log(date); setChartData({}); setStartDate(date)}}
					/>

					<CustomQuarterPicker 
					// label="End Year"
						// id="endYear"
						selectedQuarter={endDate}
						onQuarterChange={(date: Date | null) => {setChartData({}); setEndDate(date)}}
					/>
				</>} */}

				{/* {selectedPeriodType == Constant.REPORT_PERIOD_TYPE_YEARLY && <>
					<CustomYearPicker label="Start Year"
						id="startYear"
						selectedYear={startDate}
						onYearChange={(date: Date | null) => {console.log(date); setChartData({}); setStartDate(date)}}
					/>

					<CustomYearPicker label="End Year"
						id="endYear"
						selectedYear={endDate}
						onYearChange={(date: Date | null) => {setChartData({}); setEndDate(date)}}
					/>
				</>} */}


				<button className="px-4 py-2  bg-green-700 rounded text-white" onClick={() => generateReport()} >Generate chart</button>

			</div>




			{!Utils.isEmptyJSON(chartData) && <ReportDisplay reportType={selectedReportType} data={chartData} startDate={startDate} endDate={endDate} periodType={selectedPeriodType} />}


		</div>
	);
};

