/** Form component for setting or updating the user's income */

"use client";
import { JSONObject } from '@/lib/definations';
import React, { useEffect, useState } from 'react';
import * as Utils from "@/lib/utils";
import DateField from '../basics/DateField';
import mongoose from 'mongoose';
import Dropdown from '../basics/Dropdown';
import Alert from '../basics/Alert';
import * as Constant from '@/lib/constants';
import { useIncome } from '@/contexts/IncomeContext';
import { useMainUi } from '@/contexts/MainUiContext';
import * as AppStore from "@/lib/appStore";
import { useCategory } from '@/contexts/CategoryContext';
import { useBudget } from '@/contexts/BudgetContext';

export default function IncomeForm({ data = {} as JSONObject }) {

	const { setSubPage } = useMainUi();
	const { incomeCategoryList } = useCategory();
	const { budgetList } = useBudget();
	const { userId, processingStatus, setProcessingStatus, error, saveIncome, newIncome } = useIncome();

	const [income, setIncome] = useState(data);
	const [continueCreateNew, setContinueCreateNew] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		if( processingStatus === Constant.SAVE_EXPENSE_SUCCESS ) {
			if( continueCreateNew) {
				handleOnReset();
			}
			else {
				setProcessingStatus("");
				setSubPage( null );
			}
		}
	}, [processingStatus]);

	const setValue = (propName: string, value: string | Date | null) => {
		setErrMsg("");
		var tempData = Utils.cloneJSONObject(income);
		if (value == null) {
			tempData[propName] = "";
		}
		else if (value instanceof Date) {
			tempData[propName] = value.toISOString();
		}
		else {
			tempData[propName] = value;
		}

		setIncome(tempData);
	}

	const handleOnSave = (event: React.MouseEvent<HTMLButtonElement>, isContinue: boolean) => {
		event.preventDefault();
		if( checkValidation() ) {
			income.userId = userId;
			// if( income.date === undefined ) {
			// 	income.date = (new Date()).toISOString();
			// }
	
			setContinueCreateNew(isContinue);
	
			saveIncome(income);
		}
		else {
			console.log(errMsg);
			setErrMsg("Please check red fields.")
		}
	};

	const checkValidation = () => {
		return (income.categoryId === undefined 
			|| income.amount === undefined
			|| income.date === undefined
		) ? false: true;
	}


	const handleOnReset = () => {
		setIncome(Utils.cloneJSONObject(data));
	}

	const setTitle = () => {
		return (income._id != undefined) ? "Edit income" : "Add a new Income";
	}

	return (
		<div className="h-[calc(100vh-120px)] mt-5 overflow-x-auto  border-gray-400 ">
			
			{processingStatus == Constant.SAVE_EXPENSE_SUCCESS && <Alert type={Constant.ALERT_TYPE_INFO} message={`Saved successfully.`} />}
			{processingStatus == Constant.SAVE_EXPENSE_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Saving data is failed. ${error}`} />}
			{error == Constant.SAVE_EXPENSE_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Saving data is failed. ${error}`} />}
			{errMsg !== "" && <Alert type={Constant.ALERT_TYPE_ERROR} message={`${errMsg}`} />}
			
			<div className="flex items-center justify-center">
				<div className="flex-1 p-6 rounded border-2 bg-slate-100 shadow-md  max-w-xl">
					<h2 className="text-2xl mb-4 text-center">{setTitle()}</h2>

					<div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="amount">
								Amount <span className="text-red-600 ml-1">*</span>
							</label>
							<input
								type="number"
								id="amount"
								value={income.amount}
								onChange={(e) => setValue("amount", e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
								required
							/>
							{(income.amount == undefined || income.amount == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="category">
								Category <span className="text-red-600 ml-1">*</span>
							</label>
							<select
								id="categoryId"
								onChange={(e) => setValue("categoryId", e.target.value)}
								value={income.categoryId}
								className="w-full p-2 border border-gray-300 rounded"
							>
								<option value="">[Please select]</option>
								{incomeCategoryList && incomeCategoryList?.map((category: JSONObject) => (
									<option key={category._id} value={category._id}>{category.name}</option>
								))}
							</select>
							{(income.categoryId == undefined || income.categoryId == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="date">
								Date <span className="text-red-600 ml-1">*</span>
							</label>
							<DateField
								id="date"
								value={income.date}
								handleOnChange={(date) => setValue("date", date)}
								className="w-full p-2 border border-gray-300 rounded"
							/>	
							{(income.date == undefined || income.date == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="description">
								Description
							</label>
							<textarea
								id="description"
								value={income.description}
								onChange={(e) => setValue("description", e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="category">
								Budget
							</label>
							<select
								id="budgetId"
								onChange={(e) => setValue("budgetId", e.target.value)}
								value={income.budgetId}
								className="w-full p-2 border border-gray-300 rounded"
							>
								<option value="">[Please select]</option>
								{/* Only show 'Income' budgets here */}
								{budgetList && budgetList?.map((budget: JSONObject) => {
									
									const category = Utils.findItemFromList(incomeCategoryList!, budget.categoryId, "_id");
									return ( category !== null ) 
										? ( <option key={budget._id} value={budget._id}>{category.name}</option>)
										: <></>;
								
								})}
							</select>
						</div>
						

						<div className="flex justify-between items-center">
							<button
								type="submit"
								className="bg-blue-500 w-2/6 text-white px-4 py-2 rounded hover:bg-blue-600"
								onClick={(e) => handleOnSave(e, false)}
							>
								Save And Go back
							</button>
							<button
								type="submit"
								className="bg-blue-500 w-2/6 text-white px-4 py-2 rounded hover:bg-blue-600"
								onClick={(e) => handleOnSave(e, true)}
							>
								Save and Continue
							</button>
							<button
								type="button"
								onClick={() => handleOnReset()}
								className="bg-gray-500 w-1/6 text-white px-4 py-2 rounded hover:bg-gray-600"
							>
								Reset
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

