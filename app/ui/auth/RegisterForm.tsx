/** The login page for user authentication. Contains the LoginForm component. */

"use client";

import { CiUser } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IoKeyOutline } from "react-icons/io5";
import * as Constant from '@/lib/constants';
import * as Utils from "@/lib/utils";
import { JSONObject } from "@/lib/definations";
import { useMainUi } from "@/contexts/MainUiContext";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterForm() {

	const { setMainPage } = useMainUi();
	const { loading, error, user, register} = useAuth();

    const [data, setData] = useState<JSONObject>({});

	useEffect(() => {
	  if( user != null ) {
	    setMainPage( Constant.UI_BUDGET_PAGE );
	  }
	},[user])

    const setDataValue = ( propName: string, value: string ) => {
        let tempData = Utils.cloneJSONObject(data);
        tempData[propName] = value;

        setData( tempData );
    }

	const handleRegisterBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		register( data );
	};

    const handleCancelBtn = () => {
        const ok = confirm("Are you sure you don't want to register an account ?")
        if( ok ) {
            setMainPage(Constant.UI_INTRO_PAGE);
        }
    }
	

	return (
		<div className="max-w-md mx-auto p-8 h-[calc(100vh-138px)]">
			<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

			<div className="mb-4">
					<label
						className="block text-xs font-medium text-gray-900"
						htmlFor="username"
					>
						Username
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 "
							id="username"
							type="username"
							name="username"
							value={data.username}
							placeholder="Enter your username"
							required
							onChange={(e) => { setDataValue("username", e.target.value) }}
						/>
						<CiUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"></CiUser>
					</div>
				</div>
				<div className="mb-4">
					<label
						className="block text-xs font-medium text-gray-900"
						htmlFor="password"
					>
						Password
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="password"
							type="password"
							name="password"
							value={data.password}
							required
							minLength={4}
							placeholder="Enter your password"
							onChange={(e) => { setDataValue("password", e.target.value) }}
						/>
						<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
				<div className="mb-4">
					<label
						className="block text-xs font-medium text-gray-900"
						htmlFor="fullName"
					>
						Full name
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="fullName"
							type="text"
							name="fullName"
							value={data.fullName}
							required
							minLength={4}
							placeholder="Enter your full name"
							onChange={(e) => { setDataValue("fullName", e.target.value) }}
						/>
						<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
                
				<div className="mb-4">
					<label
						className="block text-xs font-medium text-gray-900"
						htmlFor="email"
					>
						email
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="email"
							type="text"
							name="email"
							value={data.email}
							required
							minLength={4}
							placeholder="Enter your email"
							onChange={(e) => { setDataValue("email", e.target.value) }}
						/>
						<IoKeyOutline className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>

				<div className="flex justify-between space-x-4">
					<button className="grid-cols-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" style={{width: "45%"}} onClick={(e) => handleRegisterBtn(e)} >
						Register
						{loading && <FaSpinner className="ml-auto  h-5 text-gray-50" />}
					</button>

					<button onClick={(e) => handleCancelBtn()} className="grid-cols-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" style={{width: "45%"}}>
						Cancel
					</button>
				</div>
				<div className="flex h-8 items-end space-x-1">
					{error !== null && <p>{error}</p>}
				</div>
				

		</div>
	);
}
