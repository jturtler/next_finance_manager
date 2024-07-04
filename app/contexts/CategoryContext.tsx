"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as Contanst from "../lib/constants";
import { JSONObject } from '@/lib/definations';
import * as Utils from '@/lib/utils';
import * as Constant from '@/lib/constants';

interface CategoryContextProps {
	categoryList: JSONObject[] | null;
    incomeList: JSONObject[] | null;
    expenseList: JSONObject[] | null;
    saveCategory: (category: JSONObject) => Promise<void>;
	deleteCategory: (categoryId: string) => Promise<void>;
    error: string | null;
    processingStatus: string;
    newCategory: JSONObject | null; // After adding new category or after updating, the new category will be set here
}

const CategoryContext = createContext<CategoryContextProps>({
	categoryList: null,
    incomeList: null,
    expenseList: null,
	saveCategory: async(category: JSONObject) => {},
	deleteCategory: async(categoryId: string) => {},
    error: null,
    processingStatus: "",
    newCategory: null
});

export const useCategory = (): CategoryContextProps => {
	const context = useContext(CategoryContext);
	if (!context) {
	  throw new Error('useCategory must be used within an CategoryProvider');
	}
	return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categoryList, setCategoryList] = useState<JSONObject[] | null>(null);
    const [incomeList, setIncomeList] = useState<JSONObject[] | null>(null);
    const [expenseList, setExpenseList] = useState<JSONObject[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processingStatus, setProcessingStatus] = useState("");
	const [newCategory, setNewCategory] = useState<JSONObject | null>(null);

	useEffect(() => {
        if( categoryList === null ) {
		    fetchCategoryList();
        }
	}, []);


    const fetchCategoryList = async () => {
        setProcessingStatus(Constant.FETCH_BUDGET_lIST_REQUEST);
        setError(null);
		try {
			const response = await fetch(`api/category`);
            console.log(response); 
            if (!response.ok) {
                setError("Network response was not ok");
                setProcessingStatus(Constant.FETCH_BUDGET_lIST_FAILURE);
            }
            else {
                const categories = await response.json();
                const incomes = categories.filter((item: JSONObject) => item.type === "income");
                const expenses = categories.filter((item: JSONObject) => item.type === "expense");
				setCategoryList(categories);
                setIncomeList(incomes);
                setExpenseList(expenses);
                setProcessingStatus(Constant.FETCH_BUDGET_lIST_SUCCESS);
            }

		} catch (err) {
			setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.FETCH_BUDGET_lIST_FAILURE);
		}
	};


    const saveCategory = async(category: JSONObject) => { 
        setProcessingStatus(Constant.SAVE_BUDGET_REQUEST);
        setError(null);

        try {
            const requestMethod = ( category._id === undefined ) ? "POST" : "PUT";
            const response = await fetch("api/category", {
                method: requestMethod,
                headers: {
                    "Content-type": "appliction/json"
                },
                body: JSON.stringify(category)
            })

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.SAVE_BUDGET_FAILURE);
            }
            else {
                var newCategory = await response.json();
                let tempList = Utils.cloneJSONObject(categoryList!);
               
                // Update list
                let foundCategory = Utils.findItemFromList(tempList!, newCategory._id, "_id");
                if( foundCategory == null ) { // Add case
                    tempList!.push( newCategory );
                }
                else { // Update case
                    Utils.findAndReplaceItemFromList(tempList!, newCategory._id, "_id", newCategory);
                }

                setNewCategory( newCategory );
                setCategoryList( tempList );
                setProcessingStatus(Constant.SAVE_BUDGET_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.SAVE_BUDGET_FAILURE);
        }
    }
 
    const deleteCategory = async(categoryId: string) => { 
        setProcessingStatus(Constant.DELETE_BUDGET_REQUEST);
        setError(null);
        
        try {
            const response = await fetch(`api/category?id=${categoryId}`, { method: "DELETE" });

            if( !response.ok ){
                setError("Network response was not ok");
                setProcessingStatus(Constant.DELETE_BUDGET_FAILURE);
            }
            else {
                // Remove this category from the list
                let tempList = Utils.cloneJSONObject(categoryList!);
                Utils.removeFromArray( tempList!, categoryId, "_id");
                setCategoryList(tempList);
                setProcessingStatus(Constant.DELETE_BUDGET_SUCCESS);
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
            setProcessingStatus(Constant.DELETE_BUDGET_FAILURE);
        }
    }

	return (
		<CategoryContext.Provider value={{ processingStatus, error, categoryList, incomeList, expenseList, saveCategory, deleteCategory, newCategory }}>
			{children}
		</CategoryContext.Provider>
	);
};
