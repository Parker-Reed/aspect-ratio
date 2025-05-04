import { useState, useEffect } from "react";
import "./AspectRatioCalculator.scss";
import Dropdown from "./Dropdown/Dropdown";
import Input from "./Input/Input";
import Button from "./Button/Button";
import Radio from "./Radio/Radio";
import Checkbox from "./Checkbox/Checkbox";
import Header from "./Header/Header";
import ImageUploader from "./ImageUploader/ImageUploader";
import "@fontsource/fredoka";

const aspectRatioOptions = [
	{
		optgroup: true,
		label: "Square",
		options: [{ value: "1:1", label: "1:1 (Square)" }],
	},
	{
		optgroup: true,
		label: "Standard",
		options: [
			{ value: "4:3", label: "4:3" },
			{ value: "3:2", label: "3:2" },
			{ value: "5:4", label: "5:4" },
			{ value: "6:5", label: "6:5" },
			{ value: "7:5", label: "7:5" },
		],
	},
	{
		optgroup: true,
		label: "Widescreen",
		options: [
			{ value: "16:9", label: "16:9" },
			{ value: "2:1", label: "2:1" },
			{ value: "21:9", label: "21:9" },
		],
	},
	{
		optgroup: true,
		label: "Golden",
		options: [{ value: "1.618:1", label: "1.618:1 (Golden Ratio)" }],
	},
];

export default function AspectRatioCalculator() {
	const [width, setWidth] = useState(16);
	const [height, setHeight] = useState(9);
	const [ratio, setRatio] = useState("");

	const [exportFormat, setExportFormat] = useState("css");
	const [overlayImage, setOverlayImage] = useState(null);

	const [unit] = useState("px");
	const [preset, setPreset] = useState("16:9");
	const [rounded] = useState(false);
	const [lockRatio, setLockRatio] = useState(false);
	const [lockedAspectRatio, setLockedAspectRatio] = useState(null);
	const [imageFit, setImageFit] = useState("contain");

	const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
	const formatValue = (val) => (rounded ? val.toFixed(2) : val);

	useEffect(() => {
		if (width && height) {
			const divisor = gcd(width, height);
			const ratioStr = `${formatValue(width / divisor)} : ${formatValue(
				height / divisor
			)}`;
			setRatio(ratioStr);
		} else {
			setRatio("");
		}
	}, [width, height, rounded]);

	const MAX_DISPLAY_SIZE = 300;
	const boxWidth =
		width > height ? MAX_DISPLAY_SIZE : (width / height) * MAX_DISPLAY_SIZE;
	const boxHeight =
		width > height ? (height / width) * MAX_DISPLAY_SIZE : MAX_DISPLAY_SIZE;

	const boxStyle = {
		width: `${boxWidth}px`,
		height: `${boxHeight}px`,
		position: "relative",
	};

	const convertValue = (value) => {
		if (unit === "px") return value;
		if (unit === "rem") return (value / 16).toFixed(2);
		if (unit === "em") return (value / 16).toFixed(2);
		return value;
	};

	const handleReset = () => {
		setWidth(16);
		setHeight(9);
		setOverlayImage(null);
		setPreset("16:9");
	};

	const getCodeSnippet = () => {
		switch (exportFormat) {
			case "css": {
				const base = `.aspect-box {\n  aspect-ratio: ${width} / ${height};\n}`;
				const fallback = `.aspect-box {\n  position: relative;\n}\n.aspect-box::before {\n  content: "";\n  display: block;\n  padding-top: ${(
					(height / width) *
					100
				).toFixed(2)}%;\n}`;
				return `${base}\n\n${fallback}`;
			}
			case "tailwind":
				return `class="aspect-[${width}/${height}]"`;
			case "inline":
				return `style={{ aspectRatio: "${width} / ${height}" }}`;
			case "jsx":
				return `<div style={{ aspectRatio: "${width} / ${height}" }} />`;
			case "scss":
				return `@mixin aspect-ratio($width, $height) {\n  aspect-ratio: #{$width} / #{$height};\n}`;
			case "react-native":
				return `const styles = StyleSheet.create({\n  box: {\n    aspectRatio: ${width} / ${height},\n  }\n});`;
			default:
				return "";
		}
	};

	return (
		<div className='aspect-ratio-calculator'>
			<Header handleReset={handleReset} />
			<div className='main-container'>
				<div className='box' id='1'>
					<Dropdown
						label='select a common aspect ratio:'
						value={preset}
						onChange={(e) => {
							const selected = e.target.value;
							setPreset(selected);
							const [w, h] = selected.split(":").map(Number);
							if (!lockRatio) {
								setWidth(w);
								setHeight(h);
							} else if (lockedAspectRatio) {
								const newWidth = Math.round(h * lockedAspectRatio);
								setWidth(newWidth);
								setHeight(h);
							}
						}}
						options={aspectRatioOptions}
					/>
					<div className='flex-container'>
						<div className='container'>
							<label>Enter your own width and height:</label>
							<div className='input-selection'>
								<Input
									placeholder='Width'
									unit={unit}
									prefixLabel='W:'
									value={convertValue(width)}
									onChange={(e) => {
										setPreset("");
										const newWidth = parseInt(e.target.value, 10) || 0;
										if (lockRatio && lockedAspectRatio) {
											const newHeight = Math.round(
												newWidth / lockedAspectRatio
											);
											setHeight(newHeight);
										}
										setWidth(newWidth);
									}}
								/>
								<Input
									placeholder='Height'
									unit={unit}
									prefixLabel='H:'
									value={convertValue(height)}
									onChange={(e) => {
										setPreset("");
										const newHeight = parseInt(e.target.value, 10) || 0;
										if (lockRatio && lockedAspectRatio) {
											const newWidth = Math.round(
												newHeight * lockedAspectRatio
											);
											setWidth(newWidth);
										}
										setHeight(newHeight);
									}}
								/>
							</div>
						</div>
						<Checkbox
							label='Lock Aspect Ratio'
							checked={lockRatio}
							onChange={() => {
								const nextLock = !lockRatio;
								setLockRatio(nextLock);
								if (nextLock && width > 0 && height > 0) {
									setLockedAspectRatio(width / height);
								}
							}}
						/>
					</div>
				</div>
				<div className='box' id='2'>
					<div className='code-container'>
						<Dropdown
							value={exportFormat}
							onChange={(e) => setExportFormat(e.target.value)}
							options={[
								{ value: "css", label: "CSS" },
								{ value: "tailwind", label: "Tailwind" },
								{ value: "inline", label: "Inline Styles" },
								{ value: "jsx", label: "JSX" },
								{ value: "scss", label: "SCSS Mixin" },
								{ value: "react-native", label: "React Native" },
							]}
						/>

						<pre>
							<code>{getCodeSnippet()}</code>
						</pre>
						<Button
							onClick={() => navigator.clipboard.writeText(getCodeSnippet())}
							className='secondary'
						>
							Copy {exportFormat.toUpperCase()}
						</Button>
					</div>
				</div>
				<div className='box' id='3'>
					<div className='title'>
						<p className='label'>Example:</p>
						<ImageUploader onUpload={setOverlayImage} />
					</div>
					<div className='visual-container'>
						<div className='visual-representation' style={boxStyle}>
							<span>{ratio}</span>
							{overlayImage && (
								<img
									src={overlayImage}
									alt='Overlay'
									style={{ objectFit: imageFit }}
								/>
							)}
						</div>
					</div>
					{overlayImage && (
						<div className='fit-options'>
							<label>Image Fit:</label>
							<Radio
								label='Contain'
								value='contain'
								checked={imageFit === "contain"}
								onChange={(e) => setImageFit(e.target.value)}
							/>
							<Radio
								label='Cover'
								value='cover'
								checked={imageFit === "cover"}
								onChange={(e) => setImageFit(e.target.value)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
