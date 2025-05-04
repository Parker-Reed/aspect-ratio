import AspectRatioCalculator from "./components/AspectRatioCalculator";

function App() {
	return (
		<div className='App'>
			<AspectRatioCalculator />
			<div className='footer'>
				Designed & built by{" "}
				<a href='https://parkerhreed.com/' alt='Parker H Reed Product Designer'>
					Parker Reed
				</a>
				<div className='wolf'>
					<img
						src='https://res.cloudinary.com/drauw0cls/image/upload/v1746331308/wolf_d8gffo.svg'
						alt='Parker Reed Product Designer'
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
