import React from "react";
import "./Button.scss";

export default function Button({ onClick, children }) {
	return (
		<button className='retro-button' onClick={onClick}>
			{children}
		</button>
	);
}
