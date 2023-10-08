function Apple({ apple }) {
	const { positionX, positionY } = apple;
	return (
		<div
			className='bg-green-400 rounded-full text-xs text-center'
			style={{
				gridArea: `${positionY}/${positionX}/auto/auto`,
				zIndex: 1,
			}}>
			&nbsp;
		</div>
	);
}

export default Apple;
