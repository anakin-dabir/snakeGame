import { useReducer, useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Lose from '../../assets/huh.mp3';
import Won from '../../assets/won.mp3';

const playSound = (win = false) => {
	const sound = win ? Won : Lose;
	const audio = new Audio(sound);
	// audio.playbackRate = 2;
	audio.src = sound;

	// Add an event listener to start playing once the audio is loaded
	audio.addEventListener('canplaythrough', () => {
		audio.play();
	});

	// If the audio is already loaded, start playing immediately
	if (audio.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
		audio.play();
	}
};

function reducer(state, action) {
	const newState = { ...state };

	if (action.type === 'create_game') {
		newState.snake = generateSnake();
	} else if (action.type === 'start_game') {
		newState.paused = newState.isStarted;
		newState.isStarted = !newState.isStarted;
		if (!newState.apple) {
			newState.apple = generateApple(newState.snake);
		}
		if (newState.direction[0] === 0 && newState.direction[1] === 0) {
			newState.direction = [1, 0];
		}
	} else if (action.type === 'stop_game') {
		newState.isStarted = false;
		newState.snake = generateSnake();
		newState.apple = null;
		newState.direction = [0, 0];
		newState.speed = 60;
		newState.currentScore = 0;
		newState.gameOver = false;
		newState.gameWon = false;
	} else if (action.type === 'move_left' && Math.abs(newState.direction[0]) !== 1) {
		newState.direction = [-1, 0];
	} else if (action.type === 'move_up' && Math.abs(newState.direction[1]) !== 1) {
		newState.direction = [0, -1];
	} else if (action.type === 'move_right' && Math.abs(newState.direction[0]) !== 1) {
		newState.direction = [1, 0];
	} else if (action.type === 'move_down' && Math.abs(newState.direction[1]) !== 1) {
		newState.direction = [0, 1];
	} else if (action.type === 'move_snake') {
		let newSnake = [...newState.snake];

		const head = { ...newSnake[newSnake.length - 1] };
		head.positionX += newState.direction[0];
		head.positionY += newState.direction[1];

		const tail = newSnake[0];
		const isValidPosition = validateSnakeHead(newSnake, head);
		if (isValidPosition) {
			newSnake.push({ ...head });
			newSnake.shift();
			if (head.positionX === newState.apple.positionX && head.positionY === newState.apple.positionY) {
				newState.previousApples.push(newState.apple);
				newState.apple = generateApple(newSnake);
				newState.currentScore += 1;
				if (newState.speed > 100) {
					newState.speed -= 10;
				}
			}
			if (
				newState.previousApples.length > 0 &&
				tail.positionX === newState.previousApples[0].positionX &&
				tail.positionY === newState.previousApples[0].positionY
			) {
				newState.previousApples.shift();
				newSnake.unshift({ ...tail });
			}
		} else {
			newState.gameOver = true;
			playSound();
		}
		if (newState.currentScore >= 12) {
			newState.gameWon = true;
			newState.apple = null;
			playSound(true);
		}
		newState.snake = newSnake;
	}

	return newState;
}

function generateSnake() {
	// const positionX = Math.floor(Math.random() * 10) + 1
	// const positionY = Math.floor(Math.random() * 10) + 1
	return [
		{ positionX: 10, positionY: 19 },
		{ positionX: 10, positionY: 18 },
		{ positionX: 10, positionY: 17 },
		{ positionX: 10, positionY: 16 },
		{ positionX: 10, positionY: 15 },
		{ positionX: 10, positionY: 14 },
		{ positionX: 10, positionY: 13 },
		{ positionX: 10, positionY: 13 },
		{ positionX: 11, positionY: 13 },
		{ positionX: 12, positionY: 13 },
		{ positionX: 13, positionY: 13 },
		{ positionX: 14, positionY: 13 },
	];
}

function generateApple(snake) {
	const positionX = Math.floor(Math.random() * 28) + 1;
	const positionY = Math.floor(Math.random() * 49) + 1;
	if (snake.some((s) => s.positionX === positionX && s.positionY === positionY)) {
		return generateApple(snake);
	}
	return { positionX, positionY };
}

function validateSnakeHead(snake, head) {
	if (
		snake.some((s) => s.positionX === head.positionX && s.positionY === head.positionY)
	) {
		return false;
	}

	if (
		head.positionX >= 0 &&
		head.positionX <= 30 &&
		head.positionY >= 1 &&
		head.positionY <= 51
	) {
		return true;
	}

	return false;
}

const initialState = {
	isStarted: false,
	snake: [],
	previousApples: [],
	apple: null,
	direction: [0, 0],
	speed: 60,
	currentScore: 0,
	gameOver: false,
	gameWon: false,
	paused: false,
};

export default function Game() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		isStarted,
		snake,
		apple,
		direction,
		speed,
		currentScore,
		gameOver,
		gameWon,
		paused,
	} = state;
	const [moving, setMoving] = useState(false);

	useEffect(() => {
		dispatch({ type: 'create_game' });
	}, []);

	useEffect(() => {
		let timer;
		if (moving && !gameOver && !gameWon) {
			document.addEventListener('keydown', handleSnakeMoveWithKeyboard);
			timer = setInterval(() => {
				dispatch({ type: 'move_snake' });
			}, speed);
		}
		return () => {
			document.removeEventListener('keydown', handleSnakeMoveWithKeyboard);
			clearInterval(timer);
		};
	}, [moving, speed, gameOver, gameWon]);

	const startGame = () => {
		const action = { type: 'start_game' };
		dispatch(action);
		const nextState = reducer(state, action);
		setMoving(nextState.isStarted);
	};
	const restartGame = useCallback(() => {
		resetGame();
		startGame();
		setMoving(true);
	}, [gameOver, gameWon]);
	const resetGame = () => {
		const action = { type: 'stop_game' };
		dispatch(action);
		const nextState = reducer(state, action);
		setMoving(nextState.isStarted);
	};

	const handleSnakeMoveWithKeyboard = (e) => {
		switch (e.keyCode) {
			case 37:
				dispatch({ type: 'move_left' });
				break;
			case 38:
				dispatch({ type: 'move_up' });
				break;
			case 39:
				dispatch({ type: 'move_right' });
				break;
			case 40:
				dispatch({ type: 'move_down' });
				break;
		}
	};

	const handleSnakeMoveWithButton = (move) => {
		if (isStarted) {
			dispatch({ type: move });
		}
	};

	return (
		<>
			<div className='flex w-full h-full md:h-[500px] md:w-[510px] bg-custom-gradient backdrop-blur-md relative items-center justify-center shrink-0 p-6 rounded-sm'>
				<NutIcon className='absolute bottom-1.5 right-1.5' />
				<NutIcon className='absolute bottom-1.5 left-1.5' />
				<NutIcon className='absolute top-1.5 right-1.5' />
				<NutIcon className='absolute top-1.5 left-1.5' />
				<div className='h-full w-full md:flex-row  flex flex-col justify-between'>
					<div className='bg-[#011627D6] h-full mx-auto md:mx-0 w-[238px] rounded-md relative'>
						{(gameOver || gameWon || paused) && (
							<div className='w-full h-12 z-20 bg-black/30 text-xl absolute top-2/3 flex items-center justify-center'>
								<p className={`${(gameOver && 'text-secondary') || ((gameWon || paused) && 'text-primary')}`}>
									{(gameOver && 'Game Over!') || (gameWon && 'Well Done!') || (paused && 'Paused!')}
								</p>
							</div>
						)}
						<div className='w-full h-full relative'>
							<Board snake={snake} apple={apple} />
						</div>
					</div>
					<div className='flex flex-col md:flex-col  self-center  gap-7 pt-4 md:pt-0 md:w-[181.38214px]'>
						<div className=' bg-[#0114231e] w-full flex flex-col p-1 text-sm rounded-md gap-4'>
							<p className='hidden md:flex'>// use keyboard arrows to play</p>
							<div className='flex flex-col items-center justify-center mt-auto [&>svg]:cursor-pointer'>
								<ArrowButton onClick={() => handleSnakeMoveWithButton('move_up')} disabled={!isStarted || gameOver || Math.abs(direction[1]) === 1}>
									↑
								</ArrowButton>
								<div className='flex items-center justify-center [&>svg]:cursor-pointer'>
									<ArrowButton onClick={() => handleSnakeMoveWithButton('move_left')} disabled={!isStarted || gameOver || Math.abs(direction[0]) === 1}>
										←
									</ArrowButton>
									<ArrowButton onClick={() => handleSnakeMoveWithButton('move_down')} disabled={!isStarted || gameOver || Math.abs(direction[1]) === 1}>
										↓
									</ArrowButton>
									<ArrowButton onClick={() => handleSnakeMoveWithButton('move_right')} disabled={!isStarted || gameOver || Math.abs(direction[0]) === 1}>
										→
									</ArrowButton>
								</div>
							</div>
						</div>
						<div className='flex flex-col text-sm p-1 gap-3'>
							<p className='hidden md:flex'>// let's go</p>

							{gameOver || gameWon ? (
								<button
									onClick={restartGame}
									className='border-primary border text-primary p-3 box-center rounded-lg hover:bg-primary hover:text-black transition-colors'>
									start-game
								</button>
							) : (
								<button
									onClick={startGame}
									className='border-primary border text-primary p-3 flex items-center justify-center rounded-lg hover:bg-primary hover:text-black transition-colors'>
									{paused ? 'resume' : ''}
									{isStarted ? 'pause' : ''}
									{!gameOver && !isStarted && !paused ? 'start-game' : ''}
								</button>
							)}
						</div>
						<div className='flex flex-col text-sm gap-2 p-1'>
							<p className='hidden md:flex'>// food left</p>
							<div className='flex gap-2 flex-wrap'>
								{Array.from({ length: 12 }, (v, i) => (
									<Dot key={i} score={currentScore} index={i} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const NutIcon = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='22'
			height='22'
			viewBox='0 0 22 22'
			fill='none'
			className={className}>
			<g filter='url(#filter0_di_64_1304)'>
				<circle cx='9.23047' cy='9.27106' r='6.5' fill='url(#paint0_radial_64_1304)' />
			</g>
			<path d='M6.46094 11.5657L11.9995 6.97635M6.46094 6.97635L11.9995 11.5657' stroke='#114944' />
			<defs>
				<filter
					id='filter0_di_64_1304'
					x='0.730469'
					y='0.771057'
					width='21'
					height='21'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'>
					<feFlood floodOpacity='0' result='BackgroundImageFix' />
					<feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
					<feOffset dx='2' dy='2' />
					<feGaussianBlur stdDeviation='2' />
					<feComposite in2='hardAlpha' operator='out' />
					<feColorMatrix type='matrix' values='0 0 0 0 0.0525 0 0 0 0 0.2625 0 0 0 0 0.255726 0 0 0 1 0' />
					<feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_64_1304' />
					<feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_64_1304' result='shape' />
					<feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
					<feOffset dy='1' />
					<feGaussianBlur stdDeviation='1' />
					<feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
					<feColorMatrix type='matrix' values='0 0 0 0 0.101667 0 0 0 0 0.508333 0 0 0 0 0.466409 0 0 0 1 0' />
					<feBlend mode='normal' in2='shape' result='effect2_innerShadow_64_1304' />
				</filter>
				<radialGradient
					id='paint0_radial_64_1304'
					cx='0'
					cy='0'
					r='1'
					gradientUnits='userSpaceOnUse'
					gradientTransform='translate(9.23047 6.27106) rotate(90) scale(9.5)'>
					<stop offset='0.151042' stopColor='#196C6A' />
					<stop offset='1' stopColor='#114B4A' />
				</radialGradient>
			</defs>
		</svg>
	);
};

const ArrowButton = ({ disabled = false, onClick, children, className }) => {
	return (
		<>
			<button
				disabled={disabled}
				onClick={onClick}
				className={`${className} bg-[#011627D6] w-11 h-7 rounded-lg m-[2px] hover:bg-[#011627D6]/50 transition-colors`}>
				{children}
			</button>
		</>
	);
};

const Dot = ({ score, index }) => {
	const color = index < score ? 'bg-secondary' : 'bg-primary';
	return (
		<div className={`w-4 h-4 ${color}/80 rounded-full box-center`}>
			<div className={`w-3 h-3 ${color} rounded-full box-center`}>
				<div className={`w-2 h-2 ${color} rounded-full box-center`}></div>
			</div>
		</div>
	);
};
