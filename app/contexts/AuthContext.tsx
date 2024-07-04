"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Utils from "@/lib/utils";


interface AuthContextProps {
	user: JSONObject | null;
	login: (username: string, pin: string) => Promise<void>;
	logout: () => void;
	register: (user: JSONObject) => Promise<void>;
	error: string | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	login: async () => { },
	logout: () => { },
	register: async(user: JSONObject) => {},
	error: null,
	loading: false
});

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (!context) {
	  throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (username: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`api/auth?username=${username}&password=${password}`);
            
			if (!response.ok) {
                setError("Network response was not ok");
            }
            else {
                const userList = await response.json();
                if (userList.length > 0 ) {
                    setUser(userList[0]);
                }
                else {
                    setError("Username/password is wrong.");
                }
            }
		} catch (err) {
			setError(Utils.getErrMessage(err));
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
	}

	const register = async(user: JSONObject) => {
		setLoading(true);
		setError(null);
			
		try {
			const response = await fetch("api/auth", {
				method: "POST",
				headers: {
					"Content-type": "appliction/json"
				},
				body: JSON.stringify(user)
			});

			if( !response.ok ){
				setError("Network response was not ok");
			}
			else {
				const newUser = await response.json();
				setUser(newUser);
			}
		}
		catch (err) {
			setError(Utils.getErrMessage(err));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthContext.Provider value={{ user, loading, error: error, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
};
