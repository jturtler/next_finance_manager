/** Lists all expenses with details such as amount, start date, and end date. */
"use client";

import { useEffect, useState } from "react"
import ExpenseItem from "./ExpenseItem"
import { JSONObject } from "@/lib/definations";
import * as Constant from "@/lib/constants";
import { useExpense } from "@/contexts/ExpenseContext";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";
import { useCategory } from "@/contexts/CategoryContext";
import CustomDatePicker from "../report/basics/DatePicker";
import * as Utils from "@/lib/utils";

export default function ExpenseList() {

	const { setSubPage } = useMainUi();
	const { expenseList } = useExpense();
	const { expenseCategoryList } = useCategory();

	const [categoryFilter, setCategoryFilter] = useState("");
	const [startDate, setStartDate] = useState<Date | null>(Utils.getStartDateOfCurrentDate());
	const [endDate, setEndDate] = useState<Date | null>(new Date());


	const filterExpenseList = () => {
		let filteredList = expenseList?.filter((item) => {

			if (categoryFilter != "" && item.categoryId != categoryFilter) {
				return false;
			}
			if (startDate != null && item.date < Utils.formatDateObjToDbDate(startDate)) {
				return false;
			}
			if (endDate != null && item.date > Utils.formatDateObjToDbDate(endDate)) {
				return false;
			}

			return true;
		});

		return filteredList === undefined ? [] : Utils.sortArrayByDate(filteredList);
	}

	const filteredList = filterExpenseList();

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-3 shadow-lg bg-white">
				<div>
					<label className="block text-gray-700 mb-2 text-sm font-bold" htmlFor='categoryFilter'>Category Filter</label>
					<select
						id="categoryFilter"
						// value={selectedReportType}
						onChange={e => setCategoryFilter(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="">All</option>
						{expenseCategoryList != null && expenseCategoryList.map((caterogy, index) => (
							<option key={index} value={caterogy._id}>
								{caterogy.name}
							</option>
						))}
					</select>
				</div>

				{/* For date range */}
				<CustomDatePicker
					label="Start Date"
					id="startDate"
					selectedDate={startDate}
					onDateChange={(date: Date | null) => { setStartDate(date) }}
				/>

				<CustomDatePicker
					label="End Date"
					id="endDate"
					selectedDate={endDate}
					onDateChange={(date: Date | null) => { setEndDate(date) }}
				/>

			<div>
				<label className="block text-gray-700 mb-2 text-sm font-bold">&nbsp;</label>
				<button 
					className=" bg-red-300 hover:bg-red-400 text-black px-10 py-2 rounded-md font-semibold"
					onClick={() => { AppStore.setSelected(null); setSubPage(Constant.SUB_UI_ADD_FORM) }}>Add</button>

			</div>
			<div className="italic font-bold text-yellow-600">There is {filteredList.length} item(s)</div>
			</div>

			{/* <div className="mx-auto p-3 shadow-md">
				<div className="overflow-y-auto h-[calc(100vh-220px)]">
					<div className="divide-y divide-gray-400 ">
						{filteredList.map((expense: JSONObject) => (
							<ExpenseItem key={expense._id} data={expense} />
						))}
					</div>
				</div>
			</div> */}

			<div className="mx-auto p-3 shadow-md">
				<div className="overflow-y-auto h-[calc(100vh-220px)]">
					<table className="min-w-full border border-red-800">
						<thead className="bg-red-200">
							<tr className="border border-red-300">
								<th className="px-4 py-2 text-left">Date</th>
								<th className="px-4 py-2 text-left">Category</th>
								<th className="px-4 py-2 text-left">Amount</th>
								<th className="px-4 py-2 text-left">Description</th>
								<th className="px-4 py-2">#</th>
							</tr>
						</thead>
						<tbody>
							{filteredList.map((expense: JSONObject) => (
								<ExpenseItem key={expense._id} data={expense} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>

	)
}

