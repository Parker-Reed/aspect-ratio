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
	const [unit, setUnit] = useState("px");
	const [preset, setPreset] = useState("");
	const [rounded, setRounded] = useState(true);

	const convertValue = (value) => {
		if (unit === "px") return value;
		if (unit === "rem") return (value / 16).toFixed(2);
		if (unit === "em") return (value / 16).toFixed(2);
		return value;
	};

	useEffect(() => {
		const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
		if (width && height) {
			const divisor = gcd(width, height);
			const format = (val) => (rounded ? val.toFixed(2) : val);
			setRatio(`${format(width / divisor)} : ${format(height / divisor)}`);
		} else {
			setRatio("");
		}
	}, [width, height, rounded]);

	const MAX_DISPLAY_SIZE = 300;

	let boxWidth = width;
	let boxHeight = height;

	if (width > height) {
		boxWidth = MAX_DISPLAY_SIZE;
		boxHeight = (height / width) * MAX_DISPLAY_SIZE;
	} else {
		boxHeight = MAX_DISPLAY_SIZE;
		boxWidth = (width / height) * MAX_DISPLAY_SIZE;
	}

	const boxStyle = {
		width: `${boxWidth}px`,
		height: `${boxHeight}px`,
		position: "relative",
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
			<h2>Aspect Ratio Calc</h2>
			<div className='unit-toggle'>
				<Dropdown
					value={unit}
					onChange={(e) => setUnit(e.target.value)}
					options={[
						{ value: "px", label: "px" },
						{ value: "rem", label: "rem" },
						{ value: "em", label: "em" },
					]}
				/>
			</div>
			<div className='inputs'>
				<Input
					placeholder='Width'
					unit={unit}
					value={convertValue(width)}
					onChange={(e) =>
						setWidth(
							unit === "px"
								? parseInt(e.target.value, 10) || 0
								: Math.round(parseFloat(e.target.value) * 16)
						)
					}
				/>
				<Input
					placeholder='Height'
					unit={unit}
					value={convertValue(height)}
					onChange={(e) =>
						setHeight(
							unit === "px"
								? parseInt(e.target.value, 10) || 0
								: Math.round(parseFloat(e.target.value) * 16)
						)
					}
				/>
			</div>
			<Dropdown
				value={preset}
				onChange={(e) => {
					const [w, h] = e.target.value.split(":").map(Number);
					setWidth(w);
					setHeight(h);
					setPreset(e.target.value);
				}}
				options={[
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
				]}
			/>
			<div className='round-toggle'>
				<label>
					<input
						type='checkbox'
						checked={rounded}
						onChange={() => setRounded(!rounded)}
					/>
					Round values
				</label>
			</div>
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
				<Button onClick={() => navigator.clipboard.writeText(getCodeSnippet())}>
					Copy {exportFormat.toUpperCase()}
				</Button>
			</div>
			<div className='code-output'>
				<h3>CSS Fallback</h3>
				<pre>
					<code>{getFallbackSnippet()}</code>
				</pre>
				<Button
					onClick={() => navigator.clipboard.writeText(getFallbackSnippet())}
				>
					Copy Fallback
				</Button>
			</div>
			<Button onClick={handleReset}>Reset</Button>
		</div>
	);
}
