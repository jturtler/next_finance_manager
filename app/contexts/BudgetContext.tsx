"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as Contanst from "../lib/constants";
import { JSONObject } from '@/lib/definations';
import * as Utils from '@/lib/utils';
import * as Constant from '@/lib/constants';

interface BudgetContextProps {
    userId: string,
	budgetList: JSONObject[] | null;
    saveBudget: (budget: JSONObject) => Promise<void>;
	deleteBudget: (budgetId: string) => Promise<void>;
    error: string | null;
    processingStatus: string;
    setProcessingStatus: (status: string) => void;
    newBudget: JSONObject | null; // After adding new budget or after updating, the new budget will be set here
}

const BudgetContext = createContext<BudgetContextProps>({
    userId: "",
	budgetList: null,
	saveBudget: async(budget: JSONObject) => {},
	deleteBudget: async(budgetId: string) => {},
    error: null,
    processingStatus: "",
    setProcessingStatus: (status: string) => {},
    newBudget: null
});

export const useBudget = (): BudgetContextProps => {
	const context = useContext(BudgetContext);
	if (!context) {
	  throw new Error('useBudget must be used within an BudgetProvider');
	}
	return context;
};

export const BudgetProvider = ({ userId, children }: { userId: string, children: ReactNode }) => {
    const [budgetList, setBudgetList] = useState<JSONObject[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processingStatus, setProcessingStatus] = useState("");
	const [newBudget, setNewBudget] = useState<JSONObject | null>(null);

	useEffect(() => {
        if( budgetList === null ) {
		    fetchBudgetList();
        }
	}, []);


    const fetchBudgetList = async () => {
        setProcessingStatus(Constant.FETCH_BUDGET_lIST_REQUEST);
        setError(null);
		try {
			const response = await fetch(`api/budget?userId=${userId}`);
            if (!response.ok) {
                setError("Network response was not ok");
                setProcessingStatus(Constant.FETCH_BUDGET_lIST_FAILURE);
            }
            else {
                const list = await response.json();
				setBudgetList(list);
                setProcessingStatus(Constant.FETCH_BUDGET_lIST_SUCCESS);
            }

		} catch (err) {
			setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.FETCH_BUDGET_lIST_FAILURE);
		}
	};

    const saveBudget = async(budget: JSONObject) => { 
        setProcessingStatus(Constant.SAVE_BUDGET_REQUEST);
        setError(null);

        try {
            const requestMethod = ( budget._id === undefined ) ? "POST" : "PUT";
            const response = await fetch("api/budget", {
                method: requestMethod,
                headers: {
                    "Content-type": "appliction/json"
                },
                body: JSON.stringify(budget)
            })

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.SAVE_BUDGET_FAILURE);
            }
            else {
                var newBudget = await response.json();
                let tempList = Utils.cloneJSONObject(budgetList!);
               
                // Update list
                let foundBudget = Utils.findItemFromList(tempList!, newBudget._id, "_id");
                if( foundBudget == null ) { // Add case
                    tempList!.push( newBudget );
                }
                else { // Update case
                    Utils.findAndReplaceItemFromList(tempList!, newBudget._id, "_id", newBudget);
                }

                setNewBudget( newBudget );
                setBudgetList( tempList );
                setProcessingStatus(Constant.SAVE_BUDGET_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.SAVE_BUDGET_FAILURE);
        }
    }
 
    const deleteBudget = async(budgetId: string) => { 
        setProcessingStatus(Constant.DELETE_BUDGET_REQUEST);
        setError(null);
        
        try {
            const response = await fetch(`api/budget?id=${budgetId}`, { method: "DELETE" });

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.DELETE_BUDGET_FAILURE);
            }
            else {
                // Remove this budget from the list
                let tempList = Utils.cloneJSONObject(budgetList!);
                Utils.removeFromArray( tempList!, budgetId, "_id");
                setBudgetList(tempList);
                setProcessingStatus(Constant.DELETE_BUDGET_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.DELETE_BUDGET_FAILURE);
        }
    }

	return (
		<BudgetContext.Provider value={{ userId, processingStatus, setProcessingStatus, error, budgetList, saveBudget, deleteBudget, newBudget }}>
			{children}
		</BudgetContext.Provider>
	);
};
