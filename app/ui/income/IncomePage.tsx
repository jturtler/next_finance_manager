"use client";

import * as Constant from "@/lib/constants";
import IncomeList from "./IncomeList";
import IncomeForm from "./IncomeForm";
import * as AppStore from "@/lib/appStore";
import { IncomeProvider } from "@/contexts/IncomeContext";
import { useMainUi } from "@/contexts/MainUiContext";
import { useAuth } from "@/contexts/AuthContext";

export default function IncomePage() {

    const { subPage } = useMainUi();
    const { user } = useAuth();

    return (
        <IncomeProvider userId={user!._id}>
            <div className="bg-green-50">
                { subPage === null && <IncomeList /> }
                { subPage == Constant.SUB_UI_ADD_FORM && <IncomeForm  />}
                { subPage == Constant.SUB_UI_EDIT_FORM && <IncomeForm data={AppStore.getSelected()!} />}
            </div>
        </IncomeProvider>
    )
}