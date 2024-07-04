import { IoMdArrowRoundBack } from "react-icons/io";
import * as Constant from "@/lib/constants";
import { IoMenuOutline } from "react-icons/io5";
import Modal from "../basics/Modal";
import { useState } from "react";
import SlideBar from "./Sidebar";
import * as Utils from "@/lib/utils";
import { useMainUi } from "@/contexts/MainUiContext";


export default function Header() {

	const { mainPage, subPage, setSubPage } = useMainUi();
	
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const subTitle = Utils.getAppHeaderSubTitle( mainPage );

	return (
        <>
			{( mainPage == Constant.UI_INTRO_PAGE || mainPage == Constant.UI_LOGIN_PAGE ) 
				? <header className="w-full py-6 bg-blue-600 text-white text-center">
					<h1 className="text-4xl font-bold">
						Personal Financial Management 
					</h1>
				</header>
				: <header className="w-full px-3 py-3 bg-blue-600 text-white flex inline-block">
					{ subPage == null && <IoMenuOutline className="text-2xl font-bold cursor-pointer hover:bg-blue-500" onClick={(e) => setIsVisible(true)} />}
					{ subPage != null && <IoMdArrowRoundBack  className="text-2xl font-bold cursor-pointer hover:bg-blue-500" onClick={(e) => setSubPage(null) } />}
					 <h2 className="text-xl pl-3 ">
						Personal Financial Management { subTitle != "" && <>- {subTitle}</>}
						</h2>
				</header> }

				<Modal isVisible={isVisible} onClose={() => setIsVisible(true)}>
					<SlideBar handleOnClose={() => setIsVisible(false)}/>
				</Modal>
		</>
    )
}