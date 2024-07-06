import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ label, id, selectedDate, onDateChange, ...rest }) => {
	return (
		<div>
			<label className="block text-gray-700 mb-2 text-sm font-bold" htmlFor={id}>{label}</label>
			<DatePicker
				{...rest}
				id={id}
				selected={selectedDate}
				onChange={date => onDateChange(date)}
				dateFormat="yyyy-MM-dd"
				className="w-full p-2 border border-gray-300 rounded"
			/>
		</div>
	);
};

export default CustomDatePicker;
