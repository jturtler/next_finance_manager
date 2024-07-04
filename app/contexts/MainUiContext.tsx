"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Contanst from "../lib/constants";

interface MainUiContextProps {
	mainPage: string;
	subPage: string | null;
	setMainPage: (pageName: string) => void;
	setSubPage: (pageName: string | null ) => void;
}

const MainUiContext = createContext<MainUiContextProps>({
	mainPage: Contanst.UI_INTRO_PAGE,
	subPage: null,
	setMainPage: (pageName: String) => {},
	setSubPage: (pageName: String | null) => {}
});

export const useMainUi = (): MainUiContextProps => {
	const context = useContext(MainUiContext);
	if (!context) {
	  throw new Error('useMainUi must be used within an MainUiProvider');
	}
	return context;
};

export const MainUiProvider = ({ children }: { children: ReactNode }) => {
	const [mainPage, setMainPage] = useState<string>(Contanst.UI_INTRO_PAGE);
	const [subPage, setSubPage] = useState<string | null>(null);

	return (
		<MainUiContext.Provider value={{ mainPage, setMainPage, subPage, setSubPage }}>
			{children}
		</MainUiContext.Provider>
	);
};
