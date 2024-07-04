"use client";

import * as Constant from "@/lib/constants";
import * as AppStore from "@/lib/appStore";
import { useMainUi } from "@/contexts/MainUiContext";
import { useAuth } from "@/contexts/AuthContext";
// import { BudgetProvider } from "@/contexts/BudgetContext";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";

export default function BudgetPage() {

    const { subPage } = useMainUi();

    return (
        <div className="bg-blue-50">
            { subPage === null && <BudgetList /> }
            { subPage == Constant.SUB_UI_ADD_FORM && <BudgetForm  />}
            { subPage == Constant.SUB_UI_EDIT_FORM && <BudgetForm data={AppStore.getSelected()!} />}
        </div>
    )
}