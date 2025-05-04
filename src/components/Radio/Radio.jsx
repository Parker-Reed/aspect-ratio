import React from "react";
import "./Radio.scss";

export default function Radio({ label, value, checked, onChange }) {
	return (
		<label className='radio'>
			<input
				type='radio'
				name='image-fit'
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<span>{label}</span>
		</label>
	);
}
