function Snake({ snake }) {
	return snake.map(({ positionX, positionY }, i) => (
		<div
			key={i}
			className='bg-secondary text-xs text-center'
			style={{
				gridArea: `${positionY}/${positionX}/auto/auto`,
				zIndex: 2,
			}}>
			&nbsp;
		</div>
	));
}

export default Snake;
