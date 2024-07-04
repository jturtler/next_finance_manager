"use client";

import * as Constant from "@/lib/constants";
import LoginForm from "./auth/LoginForm";
import HomePage from "./HomePage";
import BudgetPage from "./budget/BudgetPage";
import RegisterForm from "./auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { useMainUi } from "@/contexts/MainUiContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import ExpensePage from "./expense/ExpensePage";
import IncomePage from "./income/IncomePage";
import DashboardPage from "./dashboard/DashboardPage";
import ReportPage from "./report/ReportPage";
import { BudgetProvider } from "@/contexts/BudgetContext";

export default function AppWrapper() {
    const { mainPage } = useMainUi();
    const { user } = useAuth();
    return (
        <>
            { mainPage == Constant.UI_INTRO_PAGE && <HomePage /> }

            { mainPage == Constant.UI_LOGIN_PAGE && <LoginForm /> }

            { mainPage == Constant.UI_REGISTRATION_PAGE && <RegisterForm /> }


            {user != null && <>
                <BudgetProvider userId={user._id}>
                    { mainPage == Constant.UI_DASHBOARD_PAGE && <DashboardPage /> }

                    { mainPage == Constant.UI_BUDGET_PAGE && <BudgetPage /> }
                    { mainPage == Constant.UI_EXPENSE_PAGE && <ExpensePage /> }
                    { mainPage == Constant.UI_INCOME_PAGE && <IncomePage /> }
                </BudgetProvider>
                
                { mainPage == Constant.UI_REPORT_PAGE && <ReportPage /> }
                
            </> }
        </>
    )
}