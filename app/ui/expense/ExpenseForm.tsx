/** Form component for setting or updating the user's expense */

"use client";
import { JSONObject } from '@/lib/definations';
import React, { useEffect, useState } from 'react';
import * as Utils from "@/lib/utils";
import DateField from '../basics/DateField';
import Alert from '../basics/Alert';
import * as Constant from '@/lib/constants';
import { useExpense } from '@/contexts/ExpenseContext';
import { useMainUi } from '@/contexts/MainUiContext';
import { useCategory } from '@/contexts/CategoryContext';
import { useBudget } from '@/contexts/BudgetContext';

export default function ExpenseForm({ data = {} as JSONObject }) {

	const { setSubPage } = useMainUi();
	const { expenseList } = useCategory();
	const { budgetList } = useBudget();
	const { userId, processingStatus, setProcessingStatus, error, saveExpense, newExpense } = useExpense();

	const [expense, setExpense] = useState(data);
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
		var tempData = Utils.cloneJSONObject(expense);
		if (value == null) {
			tempData[propName] = "";
		}
		else if (value instanceof Date) {
			tempData[propName] = value.toISOString();
		}
		else {
			tempData[propName] = value;
		}

		setExpense(tempData);
	}

	const handleOnSave = (event: React.MouseEvent<HTMLButtonElement>, isContinue: boolean) => {
		event.preventDefault();
		if( checkValidation() ) {
			expense.userId = userId;
			// if( expense.date === undefined ) {
			// 	expense.date = (new Date()).toISOString();
			// }

			setContinueCreateNew(isContinue);

			saveExpense(expense);
		}
		else {
			console.log(errMsg);
			setErrMsg("Please check red fields.")
		}
	};

	const checkValidation = () => {
		return (expense.categoryId === undefined 
			|| expense.amount === undefined
			|| expense.date === undefined
		) ? false: true;
	}

	const handleOnReset = () => {
		setExpense(Utils.cloneJSONObject(data));
	}

	const setTitle = () => {
		return (expense._id != undefined) ? "Edit expense" : "Add a new Expense";
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
								value={expense.amount}
								onChange={(e) => setValue("amount", e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
								required
							/>
							{(expense.amount == undefined || expense.amount == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="category">
								Category <span className="text-red-600 ml-1">*</span>
							</label>
							<select
								id="categoryId"
								onChange={(e) => setValue("categoryId", e.target.value)}
								value={expense.categoryId}
								className="w-full p-2 border border-gray-300 rounded"
							>
								<option value="">[Please select]</option>
								{expenseList && expenseList?.map((category: JSONObject) => (
									<option key={category._id} value={category._id}>{category.name}</option>
								))}
							</select>
							{(expense.categoryId == undefined || expense.categoryId == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="date">
								Date <span className="text-red-600 ml-1">*</span>
							</label>
							<DateField
								id="date"
								value={expense.date}
								handleOnChange={(date) => setValue("date", date)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
							{(expense.date == undefined || expense.date == "" ) && <><br /><span className="text-sm italic text-red-600 ml-1">This field is required</span></>}
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2" htmlFor="description">
								Description
							</label>
							<textarea
								id="description"
								value={expense.description}
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
								value={expense.budgetId}
								className="w-full p-2 border border-gray-300 rounded"
							>
								<option value="">[Please select]</option>
								{/* Only show 'Expense' budgets here */}
								{budgetList && budgetList?.map((budget: JSONObject) => {
									
									const category = Utils.findItemFromList(expenseList!, budget.categoryId, "_id");
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

