import React, { useRef, useState } from "react";
import Button from "../Button/Button";
import "./ImageUploader.scss";

export default function ImageUploader({ onUpload }) {
	const fileInputRef = useRef(null);
	const [preview, setPreview] = useState(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target.result;
				setPreview(result);
				onUpload(result);
			};
			reader.readAsDataURL(file);
		}
	};

	const clearImage = () => {
		setPreview(null);
		fileInputRef.current.value = "";
		onUpload(null);
	};

	return (
		<div className='image-uploader'>
			{preview ? (
				<div className='preview'>
					<img src={preview} alt='Uploaded preview' />
					<Button className='close' onClick={clearImage}>
						X
					</Button>
				</div>
			) : (
				<span
					className='upload-text'
					onClick={() => fileInputRef.current.click()}
				>
					Upload a photo
				</span>
			)}
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				onChange={handleFileChange}
			/>
		</div>
	);
}
