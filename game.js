'use strict';
//##########################################################################################
// Ряд служебных функций

// 1.Проверка на пересечение
function checkBorders (a, b) {
	return (a.left > b.left && a.left < b.right
		   || a.right > b.left && a.left < b.right
		   || a.left === b.left && a.right === b.right
		   ) &&
		   (a.top > b.top && a.top < b.bottom
		   || a.bottom > b.top && a.bottom < b.bottom
		   || a.bottom === b.bottom && a.top === b.top 
		   );
}

// 2. Координаты площади
function spaceXY (pos, size) {
	let arrXY = [];
	for(let i = Math.trunc(pos.x); i <= Math.ceil(pos.x + size.x); i++) {
		for (let j = Math.trunc(pos.y); j <= Math.ceil(pos.y + size.y); j++) {
			arrXY.push(new Vector(i,j));
		}
	}
	return arrXY;
}

//##########################################################################################
// Вектор

class Vector {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
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
				 //,type = 'actor'
				) {
		if (pos instanceof Vector &&
			size instanceof Vector &&
			speed instanceof Vector) 
		{	
			this.pos = pos;
			this.size = size;
			this.speed = speed;
			//this.type = 'actor';
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
		//console.log(movingObject === this);
		if (movingObject instanceof Actor && movingObject !== undefined){
			switch (true) {
				case movingObject === this : return false;
				//case distance(movingObject.pos, this.pos) < 
				case checkBorders(movingObject, this) :return true
				default : {
					return false;
				}
			}
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}
}

Object.defineProperty(Actor, "type", {
  // writable: false, 
  // configurable :false
  enumerable: true
});


//##########################################################################################
// Игровое поле

class Level {
	constructor (grid, 
				 actors = [], 
				 //player, 
				 //height = 0,
				 //width = 0, 
				 status = null, 
				 finishDelay = 1
				 ) {
		this.grid = grid;
		this.actors = actors;
		//this.player = player;
		//this.height = height;
		//this.width = width;
		this.status = status;
		this.finishDelay = finishDelay;
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
		for(let curActor of this.actors) {
			if(curActor.type === 'player') {
				return curActor; //new Actor();
			}
		}
		/*
		this.actors.forEach(curActor => {
				
				if(curActor.type === 'player') {
					return curActor;
				}
			});
		*/
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
				/*
				this.actors.forEach( curActor => {
					
					if(curActor.isIntersect(movingActor)) {
						return curActor;
					}
				});
				*/
			}
			if(this.height === 0){
				//console.log(this.height);
				//console.log(this.actors);
				return undefined;
			}
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}
	
	// Level. Аналогично методу actorAt определяет, нет ли препятствия в указанном месте. 
	// Также этот метод контролирует выход объекта за границы игрового поля.
	obstacleAt(objPos, objSize) {
		if (objPos instanceof Vector && objSize instanceof Vector){
			switch (true) {
				case objPos.x < 0 || objPos.y < 0 || objPos.x + objSize.x > this.width : return 'wall';
				case objPos.y + objSize.y > this.height : return 'lava';
				default : {
					for (let objSpace of spaceXY(objPos, objSize)) {
						switch (true) {
							case this.grid[objSpace.x][objSpace.y] === 'wall' : return 'wall';
							case this.grid[objSpace.x][objSpace.y] === 'lava' : return 'lava';
							default : return undefined;
						}
					}
				}
			}
		} else {
			throw new Error('Положение и размер должны быть типа Vector');
		}
	}
	
	// Level. Метод удаляет переданный объект с игрового поля. 
	// Если такого объекта на игровом поле нет, не делает ничего.
	removeActor (actor) {
		if (actor instanceof Actor){
			let actorIndex = this.actors.indexOf(actor);
			this.actors.splice(actorIndex, 1);
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}
	}
	
	// Level. Определяет, остались ли еще объекты переданного типа на игровом поле.
	noMoreActors (actorType) {
		//console.log(this.actors);
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
			switch(true) {
				case (obstacle === 'lava' || obstacle === 'fireball') : {
					this.status = 'lost';
					break;
				}
				case (obstacle === 'coin' && movingObj.type === 'coin') : {
					this.removeActor(movingObj);
					
					if(this.noMoreActors('coin')){
						this.status = 'won';
					} else {
						this.status = null;
					}
					break;
				}
				default : {
					this.status = null;
				}
			}
		}
	}
}

//##########################################################################################
// Парсер уровня

class LevelParser {
	constructor (dictionary) {
		if (dictionary !== undefined) {
			for (let key in dictionary) {
				this[key] = dictionary[key];
			}
		}
	}
	
	// LevelParser. Принимает символ, строка. Возвращает конструктор объекта по его символу, 
	// используя словарь. Если в словаре не нашлось ключа с таким символом, вернет undefined.
	actorFromSymbol (objSym) {
		if(objSym === undefined || objSym === null || this[objSym] === undefined ) {
			return undefined;
		} else {
			return this[objSym];
		}
	}

	
	// LevelParser. Аналогично принимает символ, строка. Возвращает строку, соответствующую символу препятствия. 
	// Если символу нет соответствующего препятствия, то вернет undefined.
	obstacleFromSymbol (objSym) {
		switch (true) {
			case objSym === 'x' : return 'wall';
			case objSym === '!' : return 'lava';
			case objSym === undefined || objSym === null : return undefined;
			default : return undefined;
		}
	}
	
	// LevelParser. Принимает массив строк и преобразует его в массив массивов, 
	// в ячейках которого хранится либо строка, соответствующая препятствию, либо undefined.
	createGrid (gridData) {
		let resultGrid = [];
		for (let str of gridData) {
			let gridRow = [];
			for (let alpha of str) {
				gridRow.push(this.obstacleFromSymbol(alpha));
			}
			resultGrid.push(gridRow);
		}
		return resultGrid;
	}
	
	// LevelParser. Принимает массив строк и преобразует его в массив движущихся объектов, 
	// используя для их создания классы из словаря.
	createActors (gridData) {
		let resultGrid = [];

		for (let str in gridData) {
			for (let alpha in gridData[str]) {
				let actorConstructor = this.actorFromSymbol(gridData[str][alpha]);
				if( actorConstructor !== undefined && 
					typeof actorConstructor === 'function' &&
					(Actor.prototype === actorConstructor.prototype ||
					 Actor.prototype.isPrototypeOf(actorConstructor.prototype))
				  ) {
					let newActor = Object.create(actorConstructor.prototype);
					newActor.pos = new Vector(Number(alpha), Number(str));	//хммм...
					resultGrid.push(newActor);
					//resultGrid.push(new actorConstructor(new Vector(alpha, str)));
				}
			}
			
		}
		return resultGrid;
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
		//this.size = new Vector(1, 1);
		this.speed = new Vector(2, 0);
	}
}

//##########################################################################################
// Вертикальная шаровая молния

class VerticalFireball extends Fireball {
	constructor(pos) {
		super();
		this.pos = pos;
		//this.size = new Vector(1, 1);
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
		//this.size = new Vector(1, 1);
		this.speed = new Vector(0, 3);
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
			//this.pos = new Vector(pos.x + 0.2, pos.y + 0.1);
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
		//console.log(this.spring);
		this.spring += this.springSpeed * time;
		//console.log(this.spring);
	}
	
	getSpringVector () {
		return new Vector(0, (Math.sin(this.spring) * this.springDist));
		//return new Vector(0, Math.abs(Math.sin(this.spring) * this.springDist));
		//return new Vector(0, +(Math.sin(this.spring) * this.springDist).toFixed(4));
	}
	
	getNextPosition (time = 1) {
		this.updateSpring(time);
		let newVector = this.getSpringVector();
		//console.log('this.pos', this.pos);
		//console.log('newVector', newVector);
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
			//this.pos = new Vector(pos.x + 0.2, pos.y + 0.1);
			//this.pos.x += 0.2; 
			this.pos.y += -0.5;
		}
		this.size = new Vector (0.8,1.5);
		this.speed = new Vector (0,0);
		this.rn = 1;
		// this.type = 'player';
	}
	get type() {
		return 'player';
	}
};

Object.defineProperty(Player, "type", {
  // writable: false, // запретить удаление "delete user.name"
  // configurable :false
  enumerable: true
});

