import { useMainUi } from "@/contexts/MainUiContext";
import * as Constant from "@/lib/constants";

export default function HomePage() {

    const { setMainPage } = useMainUi();

	return (
		<div className="flex-grow flex flex-col items-center py-10 px-5 h-[calc(100vh-138px)]">
			<h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
			<p className="text-lg text-center max-w-2xl mb-6">
				Take control of your finances with our comprehensive personal finance management app. Track your income and expenses, set budgets, and achieve your financial goals.
			</p>
			<div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={(e) => setMainPage(Constant.UI_LOGIN_PAGE)}>Log In</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={(e) => setMainPage(Constant.UI_REGISTRATION_PAGE)}>Sign Up</button>
			</div>
		</div>
	);
};