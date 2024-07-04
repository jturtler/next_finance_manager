"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { JSONObject } from '@/lib/definations';
import * as Utils from '@/lib/utils';
import * as Constant from '@/lib/constants';

interface ExpenseContextProps {
    userId: string,
	expenseList: JSONObject[] | null;
    saveExpense: (expense: JSONObject) => Promise<void>;
	deleteExpense: (expenseId: string) => Promise<void>;
    error: string | null;
    processingStatus: string;
    setProcessingStatus: (status: string) => void;
    newExpense: JSONObject | null; // After adding new expense or after updating, the new expense will be set here
}

const ExpenseContext = createContext<ExpenseContextProps>({
    userId: "",
	expenseList: null,
	saveExpense: async(expense: JSONObject) => {},
	deleteExpense: async(expenseId: string) => {},
    error: null,
    processingStatus: "",
    setProcessingStatus: (status: string) => {},
    newExpense: null
});

export const useExpense = (): ExpenseContextProps => {
	const context = useContext(ExpenseContext);
	if (!context) {
	  throw new Error('useExpense must be used within an ExpenseProvider');
	}
	return context;
};

export const ExpenseProvider = ({ userId, children }: { userId: string, children: ReactNode }) => {
    const [expenseList, setExpenseList] = useState<JSONObject[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processingStatus, setProcessingStatus] = useState("");
	const [newExpense, setNewExpense] = useState<JSONObject | null>(null);

	useEffect(() => {
        if( expenseList === null ) {
		    fetchExpenseList();
        }
	}, []);


    const fetchExpenseList = async () => {
        setProcessingStatus(Constant.FETCH_EXPENSE_lIST_REQUEST);
        setError(null);
		try {
			const response = await fetch(`api/transaction?userId=${userId}&categoryType=expense`);
            if (!response.ok) {
                setError("Network response was not ok");
                setProcessingStatus(Constant.FETCH_EXPENSE_lIST_FAILURE);
            }
            else {
                const list = await response.json();
				setExpenseList(list);
                setProcessingStatus(Constant.FETCH_EXPENSE_lIST_SUCCESS);
            }

		} catch (err) {
			setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.FETCH_EXPENSE_lIST_FAILURE);
		}
	};

    const saveExpense = async(expense: JSONObject) => { 
        setProcessingStatus(Constant.SAVE_EXPENSE_REQUEST);
        setError(null);

        try {
            const requestMethod = ( expense._id === undefined ) ? "POST" : "PUT";
            const response = await fetch("api/transaction", {
                method: requestMethod,
                headers: {
                    "Content-type": "appliction/json"
                },
                body: JSON.stringify(expense)
            })

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.SAVE_EXPENSE_FAILURE);
            }
            else {
                var newExpense = await response.json();
                let tempList = Utils.cloneJSONObject(expenseList!);
               
                // Update list
                let foundExpense = Utils.findItemFromList(tempList!, newExpense._id, "_id");
                if( foundExpense == null ) { // Add case
                    tempList!.push( newExpense );
                }
                else { // Update case
                    Utils.findAndReplaceItemFromList(tempList!, newExpense._id, "_id", newExpense);
                }

                setNewExpense( newExpense );
                setExpenseList( tempList );
                setProcessingStatus(Constant.SAVE_EXPENSE_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.SAVE_EXPENSE_FAILURE);
        }
    }
 
    const deleteExpense = async(expenseId: string) => { 
        setProcessingStatus(Constant.DELETE_EXPENSE_REQUEST);
        setError(null);
        
        try {
            const response = await fetch(`api/transaction?id=${expenseId}`, { method: "DELETE" });

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.DELETE_EXPENSE_FAILURE);
            }
            else {
                // Remove this expense from the list
                let tempList = Utils.cloneJSONObject(expenseList!);
                Utils.removeFromArray( tempList!, expenseId, "_id");
                setExpenseList(tempList);
                setProcessingStatus(Constant.DELETE_EXPENSE_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.DELETE_EXPENSE_FAILURE);
        }
    }

	return (
		<ExpenseContext.Provider value={{ userId, processingStatus, setProcessingStatus, error, expenseList, saveExpense, deleteExpense, newExpense }}>
			{children}
		</ExpenseContext.Provider>
	);
};
