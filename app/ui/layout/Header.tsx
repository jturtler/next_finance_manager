import { IoMdArrowRoundBack } from "react-icons/io";
import * as Constant from "@/lib/constants";
import { IoMenuOutline } from "react-icons/io5";
import Modal from "../basics/Modal";
import { useState } from "react";
import SlideBar from "./Sidebar";
import * as Utils from "@/lib/utils";
import { useMainUi } from "@/contexts/MainUiContext";
import { MdOutlineDashboard } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { FaChartBar } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";


export default function Header() {

	const { mainPage, subPage, setSubPage } = useMainUi();
	
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const subTitle = Utils.getAppHeaderSubTitle( mainPage );

	const getIcon = () => {
		let icon: any;

		switch( mainPage ) {
			case Constant.UI_DASHBOARD_PAGE:
				icon = <MdOutlineDashboard className="ml-3" size={24} />;
				break;
			case Constant.UI_BUDGET_PAGE:
				icon = <FaSackDollar className="ml-3" size={24} />;
				break;
			case Constant.UI_INCOME_PAGE:
				icon = <GiReceiveMoney className="ml-3" size={24} />;
				break;
			case Constant.UI_EXPENSE_PAGE:
				icon = <GiMoneyStack className="ml-3" size={24} />;
				break;
			case Constant.UI_REPORT_PAGE:
				icon = <FaChartBar className="ml-3" size={24} />;
				break; 
			default:
				break;
		}
		return icon;
	}

	return (
        <>
			{( mainPage == Constant.UI_INTRO_PAGE || mainPage == Constant.UI_LOGIN_PAGE ) 
				? <header className="w-full py-6 bg-blue-600 text-white text-center">
					<h1 className="text-4xl font-bold">
						Personal Financial Management 
					</h1>
				</header>
				: <header className="w-full px-3 py-3 bg-blue-600 text-white flex">
					{ subPage == null && <IoMenuOutline className="text-2xl font-bold cursor-pointer hover:bg-blue-500" onClick={(e) => setIsVisible(true)} />}
					{ subPage != null && <IoMdArrowRoundBack  className="text-2xl font-bold cursor-pointer hover:bg-blue-500" onClick={(e) => setSubPage(null) } />}
					 <h2 className="text-xl mx-3 flex space-x-3">
						Personal Financial Management { subTitle != "" && <> - {getIcon()} <span>{subTitle}</span></>}
						</h2>
				</header> }

				<Modal isVisible={isVisible} onClose={() => setIsVisible(true)}>
					<SlideBar handleOnClose={() => setIsVisible(false)}/>
				</Modal>
		</>
    )
}