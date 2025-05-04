import React from "react";
import Button from "../Button/Button";
import "./Header.scss";

export default function Header({ handleReset }) {
	return (
		<header className='header'>
			<div className='title'>
				<h1>Ratio Wizard</h1>
				<h2>Aspect Ratio Calculator</h2>
			</div>
			<Button className='tertiary' onClick={handleReset}>
				Reset
			</Button>
		</header>
	);
}
