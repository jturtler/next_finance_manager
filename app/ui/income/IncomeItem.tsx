/** Displays individual income details with options to edit or delete. */

"use client";

import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as AppStore from "@/lib/appStore";
import * as Constant from "@/lib/constants";
import { AiFillDollarCircle } from "react-icons/ai";
import { useMainUi } from "@/contexts/MainUiContext";
import { FaTrash, FaShoppingCart, FaUtensils, FaHome, FaCar } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useIncome } from "@/contexts/IncomeContext";
import Alert from "../basics/Alert";
import { useCategory } from "@/contexts/CategoryContext";
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
};

export default function IncomeItem({ data, style = "large", index }: { data: JSONObject, style: string, index: number }) {

	const { setSubPage } = useMainUi();
	const { error, processingStatus, deleteIncome } = useIncome();

	const { categoryList } = useCategory();

	const setSelectedIncome = () => {
		AppStore.setSelected(data);
		setSubPage(Constant.SUB_UI_EDIT_FORM);
	}

	const handleOnDelete = () => {
		const ok = confirm(`Are you sure you want to delete this income ${data.description} ?`);
		if (ok) {
			deleteIncome(data._id);
		}
	}

	const Icon = categoryIcons[Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name] || FaShoppingCart;
	const incomeCategoryName = Utils.findItemFromList(categoryList!, data.categoryId, "_id")!.name;
	const dateStr = Utils.formatDisplayDateObj(Utils.convertDateStrToObj(data.date));

	return (
		<>
			{processingStatus == Constant.DELETE_BUDGET_SUCCESS && <Alert type={Constant.ALERT_TYPE_INFO} message={`Deleted successfully.`} />}
			{processingStatus == Constant.DELETE_BUDGET_FAILURE && <Alert type={Constant.ALERT_TYPE_ERROR} message={`Deleted Failed. ${error}`} />}

			{style == "large" && <tr className="cursor-pointer hover:bg-green-100 border border-green-300 odd:bg-green-50 even:bg-white">
				<td className="px-4 py-2" onClick={() => setSelectedIncome()}>{dateStr}</td>
				<td className="px-4 py-2 flex space-x-3" onClick={() => setSelectedIncome()}>
					<Icon className="text-green-500 w-6 h-6" />
					<span>{incomeCategoryName}</span>
				</td>
				<td className="px-4 py-2 font-bold" onClick={() => setSelectedIncome()}>{data.amount} $</td>
				<td className="px-4 py-2" onClick={() => setSelectedIncome()}>{data.description}</td>
				<td className="px-4 py-2 text-center">
					<button
						onClick={() => handleOnDelete()}
						className="text-red-500 hover:text-red-700 w-6"
					>
						<FaTrash className="w-6 h-6" />
					</button>
				</td>
			</tr>}


			{style == "small" && <div className={`m-2 flex px-4 py-2 items-center border border-green-200 rounded ${index % 2 === 0 ? "bg-white" : "bg-green-50"}`}
				onClick={() => setSelectedIncome()} >
				<Icon className="text-green-500 w-6 h-6 mr-5" />
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