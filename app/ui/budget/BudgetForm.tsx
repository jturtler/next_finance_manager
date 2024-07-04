/** Form component for setting or updating the user's budget */

"use client";
import { JSONObject } from '@/lib/definations';
import React, { useEffect, useState } from 'react';
import * as Utils from "@/lib/utils";
import DateField from '../basics/DateField';
import mongoose from 'mongoose';
import Dropdown from '../basics/Dropdown';
import Alert from '../basics/Alert';
import * as Constant from '@/lib/constants';
import { useBudget } from '@/contexts/BudgetContext';
import { useMainUi } from '@/contexts/MainUiContext';
import * as AppStore from "@/lib/appStore";
import { useCategory } from '@/contexts/CategoryContext';
import LoadingIcon from '../basics/LoadingIcon';

export default function BudgetForm({ data = {} as JSONObject }) {

	// const categories = [
	// 	'Housing',
	// 	'Utilities',
	// 	'Food',
	// 	'Transportation',
	// 	'Entertainment',
	// 	'Groceries',
	// 	'Health',
	// 	'Savings',
	// 	'Debt Payments'
	// ];

	const { setSubPage } = useMainUi();
	const { categoryList } = useCategory();
	const { userId, processingStatus, setProcessingStatus, error, saveBudget, newBudget } = useBudget();

	const [budget, setBudget] = useState(data);
	const [continueCreateNew, setContinueCreateNew] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		if( processingStatus === Constant.SAVE_BUDGET_SUCCESS ) {
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
		var tempData = Utils.cloneJSONObject(budget);
		if (value == null) {
			tempData[propName] = "";
		}
		else if (value instanceof Date) {
			tempData[propName] = value.toISOString();
		}
		else {
			tempData[propName] = value;
		}

		setBudget(tempData);
	}

	const handleOnSave = (event: React.MouseEvent<HTMLButtonElement>, isContinue: boolean) => {
		event.preventDefault();
		if( checkValidation() ) {
			budget.userId = userId;
			setContinueCreateNew(isContinue);
			saveBudget(budget);
		}
		else {
			console.log(errMsg);
			setErrMsg("Please check red fields.")
		}
	};
	
	const handleOnReset = () => {
		setBudget(Utils.cloneJSONObject(data));
	}

	const checkValidation = () => {
		return (budget.categoryId === undefined 
			|| budget.amount === undefined
			|| budget.startDate === undefined
			|| budget.endDate === undefined
		) ? false: true;
	}

	const setTitle = () => {
		return (budget._id != undefined) ? "Edit budget" : "Add a new Budget";
	}


	return (
		<div className="h-[calc(100vh-120px)] mt-5 overflow-x-auto  border-gray-400 ">

			{processingStatus == Constant.SAVE_BUDGET_SUCCESS && <Alert type={Constant.ALERT_TYPE_INFO} message={`Saved successfully.`} />}
			{processingStatus == Constant.SAVE_BUDGET_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Saving data is failed. ${error}`} />}
			{errMsg !== "" && <Alert type={Constant.ALERT_TYPE_ERROR} message={`${errMsg}`} />}

			<div className="flex items-center justify-center ">
				<div className="p-6 rounded border-2 bg-slate-100 shadow-md w-full max-w-md">
					<h2 className="text-2xl mb-4 text-center">{setTitle()}</h2>

					<div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="amount">
								Amount <span className="text-red-600 ml-1">*</span>
							</label>
							<input
								type="number"
								id="amount"
								value={budget.amount}
								onChange={(e) => setValue("amount", e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
								required
							/>
							{(budget.amount == undefined || budget.amount == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="category">
								Category <span className="text-red-600 ml-1">*</span>
							</label>
							<select
								id="categoryId"
								onChange={(e) => setValue("categoryId", e.target.value)}
								value={budget.categoryId}
								className="w-full p-2 border border-gray-300 rounded"
							>
								{categoryList && categoryList?.map((category: JSONObject) => (
									<option key={category._id} value={category._id}>({category.type}) - {category.name}</option>
								))}
							</select>
							{(budget.categoryId == undefined || budget.categoryId == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="startDate">
									Start Date <span className="text-red-600 ml-1">*</span>
								</label>
								<DateField
									id="startDate"
									value={budget.startDate}
									handleOnChange={(date) => setValue("startDate", date)}
									className="w-full p-2 border border-gray-300 rounded"
								/>
								{(budget.startDate == undefined || budget.startDate == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
							</div>
						</div>
						<div className="mb-4">
							<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="endDate">
									End Date <span className="text-red-600 ml-1">*</span>
								</label>
								<DateField
									id="endDate"
									value={budget.startDate}
									handleOnChange={(date) => setValue("endDate", date)}
									className="w-full p-2 border border-gray-300 rounded"
								/>
								{(budget.endDate == undefined || budget.endDate == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="description">
								Description 
							</label>
							<textarea
								id="description"
								value={budget.description}
								onChange={(e) => setValue("description", e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
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
								onClick={() => setBudget(data)}
								className="bg-gray-500 w-2/6 text-white px-4 py-2 rounded hover:bg-gray-600"
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

