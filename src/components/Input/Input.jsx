import React from "react";
import "./Input.scss";

export default function Input({
	label,
	value,
	onChange,
	placeholder,
	prefixLabel,
}) {
	return (
		<div className='input-wrapper'>
			{label && <label>{label}</label>}
			<div className='input-container'>
				{prefixLabel && <span className='prefix-label'>{prefixLabel}</span>}
				{prefixLabel && <span className='divider' />}
				<input
					type='number'
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}
