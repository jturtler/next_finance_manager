"use client";

import * as Constant from "@/lib/constants";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import * as AppStore from "@/lib/appStore";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { useMainUi } from "@/contexts/MainUiContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ExpensePage() {

    const { subPage } = useMainUi();
    const { user } = useAuth();

    return (
        <ExpenseProvider userId={user!._id}>
            <div className="bg-red-50">
                { subPage === null && <ExpenseList /> }
                { subPage == Constant.SUB_UI_ADD_FORM && <ExpenseForm  />}
                { subPage == Constant.SUB_UI_EDIT_FORM && <ExpenseForm data={AppStore.getSelected()!} />}
            </div>
        </ExpenseProvider>
    )
}