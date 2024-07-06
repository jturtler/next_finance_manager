/** Displays individual budget details with options to edit or delete. */

"use client";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as AppStore from "@/lib/appStore";
import * as Constant from "@/lib/constants";
import { AiFillDollarCircle } from "react-icons/ai";
import { useMainUi } from "@/contexts/MainUiContext";
import { FaTrash, FaShoppingCart, FaUtensils, FaHome, FaCar } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useBudget } from "@/contexts/BudgetContext";
import Alert from "../basics/Alert";
import { useCategory } from "@/contexts/CategoryContext";
import { RiHealthBookFill } from "react-icons/ri";
import { FcDebt } from "react-icons/fc";
import { GiClothes } from "react-icons/gi";
import { MdOutlineSchool } from "react-icons/md";
import { SiInstacart } from "react-icons/si";
import { MdDevicesOther } from "react-icons/md";
import { FaTheaterMasks } from "react-icons/fa";
import { MdAssuredWorkload } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { FaLaptopHouse } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { MdAttachMoney } from "react-icons/md";
import { LiaGiftSolid } from "react-icons/lia";
import { TbReportMoney } from "react-icons/tb";


const categoryIcons: Record<string, IconType> = {
	'Business': MdAssuredWorkload,
	'Investments': AiOutlineStock,
	'Rental Income': FaLaptopHouse,
	'Bonuses': GrMoney,
	'Gifts': LiaGiftSolid,
	'Salary': MdAttachMoney,
	'Other Income': TbReportMoney,

	// Expense Category
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


export default function BudgetItem({ data, style = "large", index }: { data: JSONObject, style: string, index: number }) {

	const { subPage, setSubPage } = useMainUi();
	const { categoryList } = useCategory();
	const { error, processingStatus, deleteBudget } = useBudget();
	
	const setSelectedBudget = () => {
		AppStore.setSelected(data);
		setSubPage(Constant.SUB_UI_EDIT_FORM);
	}

	const handleOnDelete = () => {
		const ok = confirm(`Are you sure you want to delete this budget ${data.description} ?`);
		if (ok) {
			deleteBudget(data._id);
		}
	}

	const Icon = categoryIcons[Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name] || FaShoppingCart;
	const budgetCategoryName = Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name;
	const dateRange = `${Utils.formatDate(data.startDate)} - ${Utils.formatDate(data.endDate)}`;

	return (
		<>
			{processingStatus == Constant.DELETE_BUDGET_SUCCESS && <Alert type={Constant.ALERT_TYPE_INFO} message={`Deleted successfully.`} />}
			{processingStatus == Constant.DELETE_BUDGET_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Deleted Failed. ${error}`} />}

			{style == "large" && <tr className="hover:bg-blue-100 border border-blue-300 odd:bg-blue-50 even:bg-white">
				<td className="px-4 py-2" onClick={() => setSelectedBudget()}>{dateRange} </td>
				<td className="px-4 py-2 flex space-x-3" onClick={() => setSelectedBudget()}>
					<Icon className="text-blue-500 w-6 h-6" />
					<span>{budgetCategoryName}</span>
				</td>
				<td className="px-4 py-2 font-bold" onClick={() => setSelectedBudget()}>{data.amount} $</td>
				<td className="px-4 py-2" onClick={() => setSelectedBudget()}>{data.description}</td>
				<td className="px-4 py-2 text-center">
					<button
						onClick={() => handleOnDelete()}
						className="text-red-500 hover:text-red-700 w-6"
					>
						<FaTrash className="w-6 h-6" />
					</button> 
				</td>
			</tr>}

			{style == "small" && <div className={`m-2  px-4 py-2 border border-blue-200 rounded ${index % 2 === 0 ? "bg-white" : "bg-blue-50" }`} 
						onClick={() => setSelectedBudget()} >
				<div className="mb-2">{dateRange}</div>
				<div className="mb-2 text-lg">{budgetCategoryName}
					{data.description && <span className="italic"> - {data.description}</span>}
				</div>
				<div className="font-bold">Amount: {data.amount} $</div>
			</div>}
		</>
	)
}