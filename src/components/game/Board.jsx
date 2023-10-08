import Apple from './Apple';
import Snake from './Snake';

function Board({ snake, apple }) {
	return (
		<div className='grid grid-cols-20 grid-rows-20 h-full w-full'>
			<Snake snake={snake} />
			{apple && <Apple apple={apple} />}
		</div>
	);
}

export default Board;
