import { ChangeEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Need to import this lib so that the calendar is showed  properly

// export default function DateField({id = "", disabled = false, handleOnChange = (date: Date | null) => { }, value = new Date(), ...rest}) {
export default function DateField({id = "", disabled = false, handleOnChange = (date: Date | null) => { }, value = null, ...rest}) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(value);

    const handelOnChange = ( date: Date | null) => {
        setSelectedDate(date);
        if( handleOnChange ) {
            handleOnChange(date);
        }
    }

    return (
        <DatePicker
            {...rest}
            disabled={disabled}
            className={`custom-datepicker ${rest.className}`}
            selected={selectedDate}
            onChange={(date, e) => handelOnChange(date)}
            dateFormat="yyyy-MM-dd"
        />
    );
};
