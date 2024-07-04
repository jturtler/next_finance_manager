"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { JSONObject } from '@/lib/definations';
import * as Utils from '@/lib/utils';
import * as Constant from '@/lib/constants';

interface IncomeContextProps {
    userId: string,
	incomeList: JSONObject[] | null;
    saveIncome: (income: JSONObject) => Promise<void>;
	deleteIncome: (incomeId: string) => Promise<void>;
    error: string | null;
    processingStatus: string;
    setProcessingStatus: (status: string) => void;
    newIncome: JSONObject | null; // After adding new income or after updating, the new income will be set here
}

const IncomeContext = createContext<IncomeContextProps>({
    userId: "",
	incomeList: null,
	saveIncome: async(income: JSONObject) => {},
	deleteIncome: async(incomeId: string) => {},
    error: null,
    processingStatus: "",
    setProcessingStatus: (status: string) => {},
    newIncome: null
});

export const useIncome = (): IncomeContextProps => {
	const context = useContext(IncomeContext);
	if (!context) {
	  throw new Error('useIncome must be used within an IncomeProvider');
	}
	return context;
};

export const IncomeProvider = ({ userId, children }: { userId: string, children: ReactNode }) => {
    const [incomeList, setIncomeList] = useState<JSONObject[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processingStatus, setProcessingStatus] = useState("");
	const [newIncome, setNewIncome] = useState<JSONObject | null>(null);

	useEffect(() => {
        if( incomeList === null ) {
		    fetchIncomeList();
        }
	}, []);


    const fetchIncomeList = async () => {
        setProcessingStatus(Constant.FETCH_INCOME_lIST_REQUEST);
        setError(null);
		try {
			const response = await fetch(`api/transaction?userId=${userId}&categoryType=income`);
            if (!response.ok) {
                setError("Network response was not ok");
                setProcessingStatus(Constant.FETCH_INCOME_lIST_FAILURE);
            }
            else {
                const list = await response.json();
				setIncomeList(list);
                setProcessingStatus(Constant.FETCH_INCOME_lIST_SUCCESS);
            }

		} catch (err) {
			setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.FETCH_INCOME_lIST_FAILURE);
		}
	};

    const saveIncome = async(income: JSONObject) => { 
        setProcessingStatus(Constant.SAVE_INCOME_REQUEST);
        setError(null);

        try {
            const requestMethod = ( income._id === undefined ) ? "POST" : "PUT";
            const response = await fetch("api/transaction", {
                method: requestMethod,
                headers: {
                    "Content-type": "appliction/json"
                },
                body: JSON.stringify(income)
            })

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.SAVE_INCOME_FAILURE);
            }
            else {
                var newIncome = await response.json();
                let tempList = Utils.cloneJSONObject(incomeList!);
               
                // Update list
                let foundIncome = Utils.findItemFromList(tempList!, newIncome._id, "_id");
                if( foundIncome == null ) { // Add case
                    tempList!.push( newIncome );
                }
                else { // Update case
                    Utils.findAndReplaceItemFromList(tempList!, newIncome._id, "_id", newIncome);
                }

                setNewIncome( newIncome );
                setIncomeList( tempList );
                setProcessingStatus(Constant.SAVE_INCOME_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.SAVE_INCOME_FAILURE);
        }
    }
 
    const deleteIncome = async(incomeId: string) => { 
        setProcessingStatus(Constant.DELETE_INCOME_REQUEST);
        setError(null);
        
        try {
            const response = await fetch(`api/transaction?id=${incomeId}`, { method: "DELETE" });

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.DELETE_INCOME_FAILURE);
            }
            else {
                // Remove this income from the list
                let tempList = Utils.cloneJSONObject(incomeList!);
                Utils.removeFromArray( tempList!, incomeId, "_id");
                setIncomeList(tempList);
                setProcessingStatus(Constant.DELETE_INCOME_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.DELETE_INCOME_FAILURE);
        }
    }

	return (
		<IncomeContext.Provider value={{ userId, processingStatus, setProcessingStatus, error, incomeList, saveIncome, deleteIncome, newIncome }}>
			{children}
		</IncomeContext.Provider>
	);
};
