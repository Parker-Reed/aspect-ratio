import React from "react";
import "./Input.scss";

export default function Input({
	label,
	value,
	onChange,
	unit = "px",
	placeholder,
}) {
	return (
		<div className='input-wrapper'>
			{label && <label>{label}</label>}
			<input
				type='number'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
			<span className='unit-label'>{unit}</span>
		</div>
	);
}
