import React from "react";
import "./Checkbox.scss";

export default function Checkbox({ label, checked, onChange }) {
	return (
		<div className='checkbox-input'>
			<label className='checkbox'>
				<input type='checkbox' checked={checked} onChange={onChange} />
				<span>{label}</span>
			</label>
		</div>
	);
}
