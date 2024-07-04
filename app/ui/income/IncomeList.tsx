/** Lists all incomes with details such as amount, start date, and end date. */
"use client";

import { useEffect, useState } from "react"
import IncomeItem from "./IncomeItem"
import { JSONObject } from "@/lib/definations";
import * as Constant from "@/lib/constants";
import { useIncome } from "@/contexts/IncomeContext";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";

export default function IncomeList() {
	
	const { setSubPage } = useMainUi();
	const { incomeList } = useIncome();
	
    return (
		<>
			 <div className="mx-auto p-3 shadow-md">
				<div className=" overflow-y-auto h-[calc(100vh-125px)]">
					<div className="divide-y divide-gray-200 ">
						{incomeList && incomeList.map( (income: JSONObject) => (
							<IncomeItem key={income._id} data={income}  />
						))}
					</div>
				</div>
			</div>

			{/* <!-- Floating Button --> */}
			<button className="fixed bottom-16 right-14 w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-lg flex items-center justify-center text-2xl"
			onClick={()=> {AppStore.setSelected(null); setSubPage(Constant.SUB_UI_ADD_FORM)}}> + </button>
			
		</>
		
    )
}

