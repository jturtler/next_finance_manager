/** Lists all budgets with details such as amount, start date, and end date. */
"use client";

import { useEffect, useState } from "react"
import BudgetItem from "./BudgetItem"
import { JSONObject } from "@/lib/definations";
import * as Constant from "@/lib/constants";
import { useBudget } from "@/contexts/BudgetContext";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";
import { useCategory } from "@/contexts/CategoryContext";
import * as Utils from "@/lib/utils";
import CustomDatePicker from "../report/basics/DatePicker";


export default function BudgetList() {
	
	const { setSubPage } = useMainUi();
	const { userId, budgetList } = useBudget();
	const { categoryList } = useCategory();
	
	const [categoryFilter, setCategoryFilter] = useState("");
	const [startDate, setStartDate] = useState<Date | null>(Utils.getStartDateOfCurrentDate());
	const [endDate, setEndDate] = useState<Date | null>(new Date());


	const filterBudgetList = () => {
		let filteredList = budgetList?.filter((item) => {

			if (categoryFilter != "" && item.categoryId != categoryFilter) {
				return false;
			}
			if (startDate != null && item.startDate < Utils.formatDateObjToDbDate(startDate)) {
				return false;
			}
			if (endDate != null && item.endDate > Utils.formatDateObjToDbDate(endDate)) {
				return false;
			}

			return true;
		});

		return filteredList === undefined ? [] : Utils.sortArrayByDate(filteredList);
	}

	const filteredList = filterBudgetList();

    return (
		<div className="w-full flex flex-col">
			<div className="shadow-lg bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-5 py-3 ">
				<div>
					<label className="block text-gray-700 mb-2 text-sm font-bold" htmlFor='categoryFilter'>Category Filter</label>
					<select
						id="categoryFilter"
						onChange={e => setCategoryFilter(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="">All</option>
						{categoryList != null && categoryList.map((caterogy, index) => (
							<option key={index} value={caterogy._id}>
								{caterogy.type} - {caterogy.name}
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
						className=" bg-blue-300 hover:bg-blue-400 text-black px-10 py-2 rounded-md font-semibold"
						onClick={() => { AppStore.setSelected(null); setSubPage(Constant.SUB_UI_ADD_FORM) }}>Add</button>
				</div>

				<div className="italic font-bold text-blue-600">
					{/* <label className="block text-gray-700 mb-2 text-sm font-bold">&nbsp;</label> */}
					<span>There is {filteredList.length} item(s)</span></div>
			</div>

			<div className="flex-1 p-3 shadow-md hidden md:block">
				{/* <div className=" overflow-y-auto h-[calc(100vh-270px)]"> */}
				<div className=" overflow-y-auto ">
						<table className="min-w-full border border-blue-800">
							<thead className="bg-blue-200">
								<tr className="border border-blue-300">
									<th className="px-4 py-2 text-left">Date</th>
									<th className="px-4 py-2 text-left">Category</th>
									<th className="px-4 py-2 text-left">Amount</th>
									<th className="px-4 py-2 text-left">Description</th>
									<th className="px-4 py-2">#</th>
								</tr>
							</thead>
							<tbody>
								{filteredList.map((expense: JSONObject, index: number) => (
									<BudgetItem key={expense._id} data={expense} style="large" index={index} />
								))}
							</tbody>
						</table>
					</div>
				</div>
				
				{/* <!-- Divs for smaller screens --> */}
			<div className="md:hidden">
			{filteredList.map((expense: JSONObject, index: number) => (
				<BudgetItem style="small" key={expense._id} data={expense} index={index} />
			))}
			</div>
		</div>
			
		
    )
}

