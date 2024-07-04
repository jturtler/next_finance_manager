import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// type MonthPickerProps = {
//     onMonthChange: (range: { startDate: Date; endDate: Date }) => void;
// };

const CustomMonthPicker = ({ label, id, selectedMonth, onMonthChange }) => {

	const handleMonthChange = (date: Date) => {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // last day of the month
        onMonthChange({ startDate, endDate });
    };

	return (
		<div>
			<label className="block text-gray-700 mb-2 text-sm" htmlFor={id}>{label}</label>

			<DatePicker
				id={id}
				selected={selectedMonth}
				onChange={date => handleMonthChange(date)}
				showMonthYearPicker
				dateFormat="MM/yyyy"
				className="w-full p-2 border border-gray-300 rounded"
			/>
		</div>
	);
};

export default CustomMonthPicker;
