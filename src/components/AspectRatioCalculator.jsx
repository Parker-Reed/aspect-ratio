import "@fontsource/fredoka";
import Button from "./Button/Button";
import Checkbox from "./Checkbox/Checkbox";
import Dropdown from "./Dropdown/Dropdown";
import Header from "./Header/Header";
import ImageUploader from "./ImageUploader/ImageUploader";
import Input from "./Input/Input";
import Radio from "./Radio/Radio";
import { useEffect, useState } from "react";
import "./AspectRatioCalculator.scss";

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

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const formatValue = (val, rounded) => (rounded ? val.toFixed(2) : val);
const convertValue = (value, unit) => {
	if (unit === "px") return value;
	if (unit === "rem") return (value / 16).toFixed(2);
	if (unit === "em") return (value / 16).toFixed(2);
	return value;
};

export default function AspectRatioCalculator() {
	// Dimension state
	const [width, setWidth] = useState(16);
	const [height, setHeight] = useState(9);
	const [ratio, setRatio] = useState("");
	const [preset, setPreset] = useState("16:9");

	// Aspect ratio locking
	const [lockRatio, setLockRatio] = useState(false);
	const [lockedAspectRatio, setLockedAspectRatio] = useState(null);

	// Export and display options
	const [exportFormat, setExportFormat] = useState("css");
	const [unit] = useState("px");
	const [rounded] = useState(false);

	// Image overlay
	const [overlayImage, setOverlayImage] = useState(null);
	const [imageFit, setImageFit] = useState("contain");

	// UI state
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (width && height) {
			const divisor = gcd(width, height);
			const ratioStr = `${formatValue(
				width / divisor,
				rounded
			)} : ${formatValue(height / divisor, rounded)}`;
			setRatio(ratioStr);
		} else {
			setRatio("");
		}
	}, [width, height, rounded]);

	const MAX_DISPLAY_SIZE = 400;
	const boxWidth =
		width > height ? MAX_DISPLAY_SIZE : (width / height) * MAX_DISPLAY_SIZE;
	const boxHeight =
		width > height ? (height / width) * MAX_DISPLAY_SIZE : MAX_DISPLAY_SIZE;

	const boxStyle = {
		width: `${boxWidth}px`,
		height: `${boxHeight}px`,
		position: "relative",
	};

	const handlePresetChange = (e) => {
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
	};

	const handleSwapDimensions = () => {
		setWidth(height);
		setHeight(width);
		if (lockRatio) {
			setLockedAspectRatio(height / width);
		}
	};

	const handleWidthChange = (e) => {
		setPreset("");
		const newWidth = parseInt(e.target.value, 10) || 0;
		if (lockRatio && lockedAspectRatio) {
			const newHeight = Math.round(newWidth / lockedAspectRatio);
			setHeight(newHeight);
		}
		setWidth(newWidth);
	};

	const handleHeightChange = (e) => {
		setPreset("");
		const newHeight = parseInt(e.target.value, 10) || 0;
		if (lockRatio && lockedAspectRatio) {
			const newWidth = Math.round(newHeight * lockedAspectRatio);
			setWidth(newWidth);
		}
		setHeight(newHeight);
	};

	const handleLockToggle = () => {
		const nextLock = !lockRatio;
		setLockRatio(nextLock);
		if (nextLock && width > 0 && height > 0) {
			setLockedAspectRatio(width / height);
		}
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
						onChange={handlePresetChange}
						options={aspectRatioOptions}
					/>
					<div className='flex-container'>
						<div className='container'>
							<div className='custom-width'>
								<label>Enter your own width and height:</label>
								<div className='swap-icon' onClick={handleSwapDimensions}>
									<svg
										viewBox='0 0 24 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M6 19L3 16M3 16L6 13M3 16H11C12.6569 16 14 14.6569 14 13V12M10 12V11C10 9.34315 11.3431 8 13 8H21M21 8L18 11M21 8L18 5'
											stroke='#000000'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</div>
							</div>
							<div className='input-selection'>
								<Input
									placeholder='Width'
									unit={unit}
									prefixLabel='W:'
									value={convertValue(width, unit)}
									onChange={handleWidthChange}
								/>
								<Input
									placeholder='Height'
									unit={unit}
									prefixLabel='H:'
									value={convertValue(height, unit)}
									onChange={handleHeightChange}
								/>
							</div>
						</div>
						<Checkbox
							label='Lock Aspect Ratio'
							checked={lockRatio}
							onChange={handleLockToggle}
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
							onClick={() => {
								navigator.clipboard.writeText(getCodeSnippet());
								setCopied(true);
								setTimeout(() => setCopied(false), 4000);
							}}
							className='secondary'
						>
							Copy {exportFormat.toUpperCase()}
						</Button>
					</div>
				</div>
				<div className='box' id='3'>
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
					<div className='title'>
						<p className='label'>Example:</p>
						<ImageUploader onUpload={setOverlayImage} />
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
				{copied && <div className='copied-alert'>Copied!</div>}
			</div>
		</div>
	);
}
