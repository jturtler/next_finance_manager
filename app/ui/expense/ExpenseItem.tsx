/** Displays individual expense details with options to edit or delete. */

"use client";

import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as AppStore from "@/lib/appStore";
import * as Constant from "@/lib/constants";
import { AiFillDollarCircle } from "react-icons/ai";
import { useMainUi } from "@/contexts/MainUiContext";
import { FaTrash, FaShoppingCart, FaUtensils, FaHome, FaCar } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useExpense } from "@/contexts/ExpenseContext";
import Alert from "../basics/Alert";
import { useCategory } from "@/contexts/CategoryContext";
import { RiHealthBookFill } from "react-icons/ri";
import { FcDebt } from "react-icons/fc";
import { GiClothes } from "react-icons/gi";
import { MdOutlineSchool } from "react-icons/md";
import { SiInstacart } from "react-icons/si";
import { MdDevicesOther } from "react-icons/md";
import { FaTheaterMasks } from "react-icons/fa";
import { useBudget } from "@/contexts/BudgetContext";


const categoryIcons: Record<string, IconType> = {
	'Rent': FaHome,
	'Food': FaUtensils,
	'Transportation': FaCar,
	'Insurance': SiInstacart,
	'Housing - Rent/Mortgage': FaHome,
	'Healthcare': RiHealthBookFill,
	'Debt': FcDebt,
	'Entertainment': FaTheaterMasks,
	'Personal Care': GiClothes,
	'Education': MdOutlineSchool,
	'Other Expenses': MdDevicesOther
};


export default function ExpenseItem({ data, style = "large", index }: { data: JSONObject, style: string, index: number }) {

	const { setSubPage } = useMainUi();
	const { error, processingStatus, deleteExpense } = useExpense();

	const { categoryList } = useCategory();
	const { budgetList } = useBudget();

	const setSelectedExpense = () => {
		AppStore.setSelected(data);
		setSubPage(Constant.SUB_UI_EDIT_FORM);
	}

	const handleOnDelete = () => {
		const ok = confirm(`Are you sure you want to delete this expense ${data.description} ?`);
		if (ok) {
			deleteExpense(data._id);
		}
	}

	const getBudgetCategory = (): string => {
		const budgetId = data.budgetId;
		if (budgetId !== undefined) {
			const foundBudget = Utils.findItemFromList(budgetList!, budgetId, "_id");
			if (foundBudget !== null) {
				const foundCategory = Utils.findItemFromList(categoryList!, foundBudget.categoryId, "_id");
				return (foundCategory === null) ? "[none]" : foundCategory.name;
			}
		}

		return "[none]"
	}

	const Icon = categoryIcons[Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name] || FaShoppingCart;
	const budgetCategory = getBudgetCategory();
	const dateStr = Utils.formatDisplayDateObj(Utils.convertDateStrToObj(data.date));

	return (
		<>
			{processingStatus == Constant.DELETE_BUDGET_SUCCESS && <Alert type={Constant.ALERT_TYPE_INFO} message={`Deleted successfully.`} />}
			{processingStatus == Constant.DELETE_BUDGET_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Deleted Failed. ${error}`} />}

			{style == "large" && <tr className="hover:bg-red-100 border border-red-300 odd:bg-red-50 even:bg-white">
				<td className="px-4 py-2" onClick={() => setSelectedExpense()}>{dateStr}</td>
				<td className="px-4 py-2 flex space-x-3" onClick={() => setSelectedExpense()}>
					<Icon className="text-red-500 w-6 h-6" />
					<span>{Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name}</span>
				</td>
				<td className="px-4 py-2 font-bold" onClick={() => setSelectedExpense()}>{data.amount} $</td>
				<td className="px-4 py-2" onClick={() => setSelectedExpense()}>{data.description}</td>
				<td className="px-4 py-2" onClick={() => setSelectedExpense()}>{budgetCategory}</td>
				<td className="px-4 py-2 text-center">
					<button
						onClick={() => handleOnDelete()}
						className="text-red-500 hover:text-red-700 w-6"
					>
						<FaTrash className="w-6 h-6" />
					</button>
				</td>
			</tr>}

			{style == "small" && <div className={`m-2 flex px-4 py-2 items-center border border-red-200 rounded ${index % 2 === 0 ? "bg-white" : "bg-red-50"}`}
				onClick={() => setSelectedExpense()} >
				<Icon className="text-red-500 w-6 h-6 mr-5" />
				<div className="flex-1">
					<div className="mb-2">{dateStr}</div>
					<div className="mb-2 italic text-sm flex flex-row space-x-3">
						<span>{Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name}</span>
						{data.description && <> <span>-</span> <span>{data.description}</span></>}
					</div>
					<div className="font-bold">Amount: {data.amount} $</div>
				</div>
			</div>}
		</>
	)
}