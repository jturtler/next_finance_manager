"use client";

import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useAuth } from '@/contexts/AuthContext';
import * as Utils from "@/lib/utils";
import DatePicker from 'react-datepicker';
import * as Constant from "@/lib/constants";
import * as ReportService from "@/lib/services/reportService";
import { JSONObject } from '@/lib/definations';
import IncomeVsExpenseBarChart from '../report/incomeVsExpenseReport/IncomeVsExpenseBarChart';
import { useCategory } from '@/contexts/CategoryContext';
import BudgetVsActualProcessBar from '../report/budgetVsActualReport/budgetVsActualProcessBar';
import CategoryWiseExpensePieChart from '../report/caterogyWiseExpenseReport/CategoryWiseExpensePieChart';
import { MdOutlineDashboard } from "react-icons/md";
import IncomeVsExpenseReportDetails from '../report/incomeVsExpenseReport/IncomeVsExpenseReportDetails';


export default function DashboardPage() {

	const { user } = useAuth();
    const { expenseCategoryList, incomeCategoryList } = useCategory();
	const [incomeVsExpenseChartData, setIncomeVsExpenseChartData] = useState<JSONObject | JSONObject[]>([]);
	const [budgetVsActualChartData, setBudgetVsActualChartData] = useState<JSONObject | JSONObject[]>({});
	const [categoryWiseExpenseChartData, setCategoryWiseExpenseChartData] = useState<JSONObject | JSONObject[]>([]);

    const getDateRange = (): JSONObject => {
        const curYear = new Date().getFullYear();

        return {
            startDate: new Date(`${curYear}-01-01T00:00:00`),
            endDate: new Date(`${curYear}-12-31T00:00:00`),
            year: curYear
        }
    }

    useEffect(() => {
        generateIncomeVsExpenseReport();
        generateBudgetVsActutalReport();
        generateCategoryWiseExpenseReport();
    }, [])

    const generateIncomeVsExpenseReport = async() => {

		const urlPath = "income-vs-expense";
		const payload = {
			userId: user!._id,
			startDate: dateRange.startDate,
			endDate: dateRange.endDate,
			periodType: Constant.REPORT_PERIOD_TYPE_MONTHLY
		}

		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);
		if (tempChartData.errMsg === undefined) {
			setIncomeVsExpenseChartData(tempChartData.data);
		}
		else {
			// Show error message here
		}
	}

    const generateBudgetVsActutalReport = async() => {
		const urlPath = "budget-vs-actual"; 
		const payload = {
			userId: user!._id,
			startDate: dateRange.startDate, 
			endDate: dateRange.endDate
		}
		
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);

		if (tempChartData.errMsg === undefined) {
			setBudgetVsActualChartData(tempChartData);
		}
		else {
			// Show error message here
		}
    }

    const generateCategoryWiseExpenseReport = async() => {
		const urlPath = "income-vs-expense";
		const payload = {
			userId: user!._id,
			startDate: dateRange.startDate, 
			endDate: dateRange.endDate,
            periodType: Constant.REPORT_PERIOD_TYPE_MONTHLY
		}
		
		const tempChartData = await ReportService.retrieveAggregateData(urlPath, payload);
		if (tempChartData.errMsg === undefined) {
			setCategoryWiseExpenseChartData(tempChartData.data);
		}
		else {
			// Show error message here
		}
    }
    
    const dateRange: JSONObject = getDateRange();
    

    return (
        <div className="p-4 bg-orange-50">
            <div className="mx-auto p-4">
               
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Budget Process {dateRange.year}</h2>
                        <BudgetVsActualProcessBar data={budgetVsActualChartData} />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Category Wise Expense {dateRange.year}</h2>
                        <CategoryWiseExpensePieChart data={categoryWiseExpenseChartData} />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-md mb-5">
                    <h2 className="text-xl font-bold mb-4">Income vs Expense Report {dateRange.year}</h2>
                    <IncomeVsExpenseBarChart data={incomeVsExpenseChartData} 
                        startDate={dateRange.startDate} 
                        endDate={dateRange.endDate} 
                        periodType={Constant.REPORT_PERIOD_TYPE_MONTHLY} 
                        categoryExpenseList={expenseCategoryList}
                        categoryIncomeList={incomeCategoryList} />
                </div>

                <div>
                    <IncomeVsExpenseReportDetails data={incomeVsExpenseChartData} />
                </div>
            </div>
        </div>
    );
};