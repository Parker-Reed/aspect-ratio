import React from "react";
import "./ImageUploader.scss";

export default function ImageUploader({ onUpload }) {
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				onUpload(event.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='image-uploader'>
			<input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				style={{ marginTop: "15px" }}
			/>
		</div>
	);
}
