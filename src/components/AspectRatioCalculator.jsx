import { useState, useEffect } from "react";
import "./AspectRatioCalculator.scss";
import Dropdown from "./Dropdown/Dropdown";
import Input from "./Input/Input";
import Button from "./Button/Button";
import ImageUploader from "./ImageUploader/ImageUploader";
import "@fontsource/fredoka";

export default function AspectRatioCalculator() {
	const [width, setWidth] = useState(16);
	const [height, setHeight] = useState(9);
	const [ratio, setRatio] = useState("");

	const [exportFormat, setExportFormat] = useState("css");
	const [overlayImage, setOverlayImage] = useState(null);

	const [unit] = useState("px");
	const [preset, setPreset] = useState("");
	const [rounded] = useState(false);
	const [lockRatio, setLockRatio] = useState(false);
	const [lockedAspectRatio, setLockedAspectRatio] = useState(null);

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
		setPreset("");
	};

	const getCodeSnippet = () => {
		switch (exportFormat) {
			case "css":
				return `.aspect-box {\n  aspect-ratio: ${width} / ${height};\n}`;
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

	const getFallbackSnippet = () => {
		const ratioPercent = ((height / width) * 100).toFixed(2);
		return `.aspect-box {\n  position: relative;\n}\n.aspect-box::before {\n  content: "";\n  display: block;\n  padding-top: ${ratioPercent}%;\n}`;
	};

	return (
		<div className='aspect-ratio-calculator'>
			<div className='header'>
				<div className='title'>
					<h1>Ratio Wizard</h1>
					<h2>Aspect Ratio Calculator</h2>
				</div>
				<Button onClick={handleReset}>Reset</Button>
			</div>
			<div className='main-container'>
				<div className='controls'>
					<div className='tool-container'>
						<div className='inputs'>
							<Input
								placeholder='Width'
								unit={unit}
								prefixLabel='W:'
								value={convertValue(width)}
								onChange={(e) => {
									const newWidth = parseInt(e.target.value, 10) || 0;
									if (lockRatio && lockedAspectRatio) {
										const newHeight = Math.round(newWidth / lockedAspectRatio);
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
									const newHeight = parseInt(e.target.value, 10) || 0;
									if (lockRatio && lockedAspectRatio) {
										const newWidth = Math.round(newHeight * lockedAspectRatio);
										setWidth(newWidth);
									}
									setHeight(newHeight);
								}}
							/>
						</div>
						<div className='input checkbox-input'>
							<label>
								<input
									type='checkbox'
									checked={lockRatio}
									onChange={() => {
										const nextLock = !lockRatio;
										setLockRatio(nextLock);
										if (nextLock && width > 0 && height > 0) {
											setLockedAspectRatio(width / height);
										}
									}}
								/>
								<span>Lock Aspect Ratio</span>
							</label>
						</div>
					</div>
					<div className='code-container'>
						<div className='code-output'>
							<div className='format-select'>
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
							</div>
							<pre>
								<code>{getCodeSnippet()}</code>
							</pre>
							<Button
								onClick={() => navigator.clipboard.writeText(getCodeSnippet())}
							>
								Copy {exportFormat.toUpperCase()}
							</Button>
						</div>
						{exportFormat === "css" && (
							<div className='code-output'>
								<h3>CSS Fallback</h3>
								<pre>
									<code>{getFallbackSnippet()}</code>
								</pre>
								<Button
									onClick={() =>
										navigator.clipboard.writeText(getFallbackSnippet())
									}
								>
									Copy Fallback
								</Button>
							</div>
						)}
					</div>
				</div>
				<div className='grid-container'>
					{ratio && <p className='ratio'>Ratio: {ratio}</p>}
					<div className='visual-container'>
						<div className='visual-representation' style={boxStyle}>
							{overlayImage && (
								<img
									src={overlayImage}
									alt='Overlay'
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
										borderRadius: "12px",
									}}
								/>
							)}
							<span>{ratio}</span>
						</div>
					</div>
					<ImageUploader onUpload={setOverlayImage} />
				</div>
			</div>
		</div>
	);
}
