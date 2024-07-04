import { JSONObject } from '@/lib/definations';
import React, { useState, useEffect, useRef } from 'react';

interface DropdownProps {
	options: string[];
}

export default function Dropdown({ options, handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => { }, ...rest})  {
	const initValue = ( rest.value == undefined ) ? "" : rest.value;

	const [isOpen, setIsOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState<JSONObject[]>(options);
	const [inputValue, setInputValue] = useState(initValue);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
		setIsOpen(true);

		handleOnChange(event);
	};

	const handleOptionClick = (option: JSONObject) => {
		setInputValue(option);
		setIsOpen(false);

		let e = {target: {value: option._id }} as React.ChangeEvent<HTMLInputElement>;
		handleOnChange(e);
	};

	return (
		<div className={`relative w-full`} ref={dropdownRef}>
			<input
				{...rest}
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onClick={() => setIsOpen(true)}
				placeholder="Select or type..."
			/>
			{isOpen && (
				<div className="absolute mt-1 w-full bg-white border rounded">
					{filteredOptions.map((option, index) => (
						<div
							key={index}
							className="p-2 cursor-pointer hover:bg-gray-200"
							onClick={() => handleOptionClick(option)}
						>
							{option.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
