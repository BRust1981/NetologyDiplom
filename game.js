'use strict';

//##########################################################################################
// Вектор

class Vector {
	constructor (x = 0, y = 0) {
		if(typeof x === 'number' && isFinite(x) && typeof y === 'number' && isFinite(y)) {
			this.x = x;
			this.y = y;
		}
	}
	// Создает и возвращает новый объект типа Vector, 
	// координаты которого будут суммой соответствующих координат суммируемых векторов.
	// Принимает один аргумент — вектор, объект Vector
	plus (addVector) {
		if(addVector instanceof Vector) {
			let newVector = new Vector();
			newVector.x = this.x + addVector.x;
			newVector.y = this.y + addVector.y;
			return newVector;
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Можно прибавлять к вектору только вектор типа Vector');
		}
	}
	
	times (factor) {
		let newVector = new Vector();
		newVector.x = this.x * factor;
		newVector.y = this.y * factor;
		return newVector;
	}
}

//##########################################################################################
// Движущийся объект

class Actor {
	constructor (pos = new Vector (0, 0), 
				 size = new Vector (1, 1), 
				 speed = new Vector (0, 0)
				) {
		if (pos instanceof Vector &&
			size instanceof Vector &&
			speed instanceof Vector) 
		{	
			this.pos = pos;
			this.size = size;
			this.speed = speed;
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Позиция, размер и скорость могут быть только типа Vector');
		}
	}
	
	// свойство type — строку со значением actor, только для чтения.
	get left() {
		return this.pos.x; //new Vector (this.pos.x - this.size.x, this.pos.y);
	}
	
	// свойство type — строку со значением actor, только для чтения.
	get right() {
		return this.pos.x + this.size.x;
	}
	
	// свойство type — строку со значением actor, только для чтения.
	get top() {
		return this.pos.y;
	}
	
	// свойство type — строку со значением actor, только для чтения.
	get bottom() {
		return this.pos.y + this.size.y;
	}
	
	// свойство type — строку со значением actor, только для чтения.
	get type() {
		return 'actor';
	}
	
	// метод act, который ничего не делает.
	act () {
	}

	// Actor. Метод проверяет, пересекается ли текущий объект с переданным объектом, 
	// и если да, возвращает true, иначе – false.
	isIntersect (movingObject) {
		if (movingObject instanceof Actor && movingObject !== undefined){
			if(movingObject === this) {
				return false;
			} else {
				return ((this.left > movingObject.left && this.left < movingObject.right
					   || this.right > movingObject.left && this.left < movingObject.right
					   || this.left === movingObject.left && this.right === movingObject.right
					   ) &&
					   (this.top > movingObject.top && this.top < movingObject.bottom
					   || this.bottom > movingObject.top && this.bottom < movingObject.bottom
					   || this.bottom === movingObject.bottom && this.top === movingObject.top 
					   ));
			}
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}
}

//##########################################################################################
// Игровое поле

class Level {
	constructor (grid = [], 
				 actors = []
				 ) {
		this.grid = grid;
		this.actors = actors;
		this.status = null;
		this.finishDelay = 1;
		
	}
	 get height() {
		 return this.grid == undefined ? 0 : this.grid.length;
	 }
	 get width() {
		 if(this.grid == undefined) {
			 return 0;
		 } else {
			let maxWidth = 0;

			this.grid.forEach(subArr => {
			  maxWidth = Math.max(subArr.length, maxWidth);
			});
			return maxWidth;
		}
	}
	
	 get player() {
		 return this.actors.find(elem => {
			 return elem.type === 'player';
		 });
	 }
	
	// Level. Определяет, завершен ли уровень. Не принимает аргументов.
	isFinished() {
		return this.status !== null && this.finishDelay < 0 ? true : false;
	}
	
	// Level. Определяет, расположен ли какой-то другой движущийся объект в переданной позиции, 
	// и если да, вернёт этот объект.
	actorAt(movingActor) {
		if (movingActor instanceof Actor || movingActor === undefined){
			if(this.actors !== undefined) {
				for(let curActor of this.actors) {
					if(curActor.isIntersect(movingActor)) {
						return curActor; //new Actor();
					}
				}
			}
			if(this.height === 0){
				return undefined;
			}
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}

	spaceXY (pos, size) {
		for (let j = Math.trunc(pos.y); j < Math.ceil(pos.y + size.y); j++) {
			for(let i = Math.trunc(pos.x); i < Math.ceil(pos.x + size.x); i++) {
				if(this.grid[j][i] !== undefined) {
					return this.grid[j][i];
				}
			}
		}
		return undefined;
	}

	// Level. Аналогично методу actorAt определяет, нет ли препятствия в указанном месте. 
	// Также этот метод контролирует выход объекта за границы игрового поля.
	obstacleAt(objPos, objSize) {
		if (objPos instanceof Vector && objSize instanceof Vector){
			if(objPos.x < 0 || objPos.y < 0 || objPos.x + objSize.x > this.width) {
				return 'wall';
			} else if (objPos.y + objSize.y > this.height) {
				return 'lava';
			} else {
				return this.spaceXY(objPos, objSize);
			}
		} else {
			throw new Error('Положение и размер должны быть типа Vector');
		}
	}
	
	// Level. Метод удаляет переданный объект с игрового поля. 
	// Если такого объекта на игровом поле нет, не делает ничего.
	removeActor (actor) {
		if (Actor.prototype.isPrototypeOf(actor)){
			let actorIndex = this.actors.indexOf(actor);
			this.actors.splice(actorIndex, 1);
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}
	
	// Level. Определяет, остались ли еще объекты переданного типа на игровом поле.
	noMoreActors (actorType) {
	if(this.actors.length !== 0 && this.actors !== undefined) {
			for(let curActor of this.actors) {
				if(curActor.type === actorType) {
					return false; 
				}
			}
			return true;
		} else {
			return true;
		}
	}
	
	// Level. Один из ключевых методов, определяющий логику игры. 
	// Меняет состояние игрового поля при касании игроком каких-либо объектов или препятствий.
	playerTouched(obstacle, movingObj) {
		if(this.status === null) {
			if (obstacle === 'lava' || obstacle === 'fireball') {
				this.status = 'lost';
			} else if (obstacle === 'coin' && movingObj.type === 'coin') {
				this.removeActor(movingObj);
				if(this.noMoreActors('coin')){
					this.status = 'won';
				} else {
					this.status = null;
				}
			} else {
				this.status = null;
			}
		}
	}
}

//##########################################################################################
// Парсер уровня

class LevelParser {
	constructor (dictionary) {
		if (dictionary !== undefined) {
			this.dictionary = dictionary;
		}
	}
	
	// LevelParser. Принимает символ, строка. Возвращает конструктор объекта по его символу, 
	// используя словарь. Если в словаре не нашлось ключа с таким символом, вернет undefined.
	actorFromSymbol (objSym) {

		if(objSym === undefined || objSym === null || this.dictionary[objSym] === undefined ) {
			return undefined;
		} else {
			return this.dictionary[objSym];
		}
	}

	
	// LevelParser. Аналогично принимает символ, строка. Возвращает строку, соответствующую символу препятствия. 
	// Если символу нет соответствующего препятствия, то вернет undefined.
	obstacleFromSymbol (objSym) {
		switch (objSym) {
			case 'x' : return 'wall';
			case '!' : return 'lava';
			default : return undefined;
		}
	}
	
	// LevelParser. Принимает массив строк и преобразует его в массив массивов, 
	// в ячейках которого хранится либо строка, соответствующая препятствию, либо undefined.
	createGrid (gridData) {
		
		return gridData.map(el => {
			 return [...el].map( el2 => {
				 return this.obstacleFromSymbol(el2);
			 });
		});
	}
	
	// LevelParser. Принимает массив строк и преобразует его в массив движущихся объектов, 
	// используя для их создания классы из словаря.
	createActors (gridData) {

		let resultGrid = [];
		if(this.dictionary === undefined) {
			return [];
		} else {
			gridData.forEach((el, index) => {
				[...el].forEach((el2, index2) => {
					let actorConstructor = this.actorFromSymbol(gridData[index][index2]);
					if( actorConstructor !== undefined && 
						typeof actorConstructor === 'function' &&
						(Actor.prototype === actorConstructor.prototype ||
						 Actor.prototype.isPrototypeOf(actorConstructor.prototype))
					  ) {
						resultGrid.push(new actorConstructor(new Vector(index2, index)));
					}
				});
			});
			return resultGrid;
		}
	}
	
	// LevelParser. Принимает массив строк, создает и возвращает игровое поле, 
	// заполненное препятствиями и движущимися объектами, полученными на основе символов и словаря.
	parse (gridData) {
		return new Level(this.createGrid(gridData),
						 this.createActors(gridData)
						);
	}
}

//##########################################################################################
// Шаровая молния

class Fireball extends Actor {
	constructor(pos, speed) {
		super();
		this.pos = pos;
		this.size = new Vector(1, 1);
		this.speed = speed;
	}
	get type() {
		return 'fireball';
	}

	// Fireball. Создает и возвращает вектор Vector следующей позиции шаровой молнии. 
	// Это функция времени. И как в школьной задаче, новая позиция — это текущая позиция плюс скорость, 
	// умноженная на время. И так по каждой из осей.
	
	getNextPosition (time = 1) {
		return new Vector (this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
	}
	
	// Fireball. Обрабатывает столкновение молнии с препятствием. Не принимает аргументов. 
	// Ничего не возвращает.
	handleObstacle() {
		this.speed.x *= -1;
		this.speed.y *= -1;
	}
	
	// Fireball. Обновляет состояние движущегося объекта.
	act (time, curLevel) {
		let nextPosition = this.getNextPosition(time);
		if(curLevel.obstacleAt(nextPosition, this.size) === undefined) {
			this.pos = nextPosition;
		} else {
			this.handleObstacle();
		}
	}
}

//##########################################################################################
// Горизонтальная шаровая молния

class HorizontalFireball extends Fireball {
	constructor(pos) {
		super();
		this.pos = pos;
		this.speed = new Vector(2, 0);
	}
}

//##########################################################################################
// Вертикальная шаровая молния

class VerticalFireball extends Fireball {
	constructor(pos) {
		super();
		this.pos = pos;
		this.speed = new Vector(0, 2);
	}
}

//##########################################################################################
// Огненный дождь

class FireRain extends Fireball {
	constructor(pos) {
		super();
		this.pos = pos;
		this.initPos = pos;
		this.speed = new Vector(0, 1);
	}
	handleObstacle() {
		this.pos = this.initPos;
	}
}

//##########################################################################################
// Монета

class Coin extends Actor {
	constructor(pos) {
		super();
		if(pos !== undefined) {
			this.realpos = pos;
			this.pos.x = this.realpos.x + 0.2;
			this.pos.y = this.realpos.y + 0.1;
		}
		
		if(this.pos !== undefined && this.initpos === undefined) {
			this.initpos = this.pos;
		}
		
		this.size = new Vector(0.6, 0.6);
		this.speed = new Vector(0, 3);
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = Math.random() * 2 * Math.PI;
	}
	get type() {
		return 'coin';
	}
	
	updateSpring (time = 1) {
		this.spring += this.springSpeed * time;
	}
	
	getSpringVector () {
		return new Vector(0, (Math.sin(this.spring) * this.springDist));
	}
	
	getNextPosition (time = 1) {
		this.updateSpring(time);
		let newVector = this.getSpringVector();
		return new Vector (this.pos.x, this.initpos.y + newVector.y);
	}
	
	act (time) {
		this.pos = this.getNextPosition(time);
	}
}

//##########################################################################################
// Игрок

class Player extends Actor {
	constructor (pos) {
		super();
		if(pos !== undefined) {
			this.pos = pos;
			this.pos.y += -0.5;
		}
		this.size = new Vector (0.8,1.5);
		this.speed = new Vector (0,0);
		this.rn = 1;
	}
	get type() {
		return 'player';
	}
};


loadLevels()
	.then(function(levelJSON) {
		const actorDict = {
			  '@': Player,
			  '=': HorizontalFireball,
			  'o': Coin,
			  '|': VerticalFireball,
			  'v': FireRain
			};
		const parser = new LevelParser(actorDict);
		
		runGame(JSON.parse(levelJSON), parser, DOMDisplay)
			.then(() => alert('Вы выиграли приз!'));
	});



