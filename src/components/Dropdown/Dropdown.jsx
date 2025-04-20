import React from "react";
import "./Dropdown.scss";

export default function Dropdown({ label, value, onChange, options }) {
	return (
		<div className='dropdown'>
			{label && <label>{label}</label>}
			<select value={value} onChange={onChange}>
				{options.map((opt, idx) =>
					opt.optgroup ? (
						<optgroup key={idx} label={opt.label}>
							{opt.options.map((o, i) => (
								<option key={i} value={o.value}>
									{o.label}
								</option>
							))}
						</optgroup>
					) : (
						<option key={idx} value={opt.value}>
							{opt.label}
						</option>
					)
				)}
			</select>
		</div>
	);
}
