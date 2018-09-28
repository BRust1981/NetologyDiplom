'use strict';
//Проверка на пересечение
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

class Vector {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	// Создает и возвращает новый объект типа Vector, координаты которого будут суммой соответствующих координат суммируемых векторов.
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


class Level {
	constructor (grid, 
				 actors, 
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
		this.actors.forEach(curActor => {
				
				if(curActor.type === 'player') {
					console.log('2');
					console.log(curActor);
					return curActor;
				}
			});
	}
	
	isFinished() {
		return this.status !== null && this.finishDelay < 0 ? true : false;
	}
	actorAt(movingActor) {
			
		if (movingActor instanceof Actor || movingActor === undefined){
			//console.log(movingActor);
			//console.log(this.actors);
			this.actors.forEach(curActor => {
				
				if(curActor.isIntersect(movingActor)) {
					console.log('1');
					console.log(curActor);
					return curActor;
				}
			});
			/*
			if(this.height === 0){
				//console.log(this.height);
				console.log(this.actors);
				return undefined;
			}
*/
		} else {
			// Если передать аргумент другого типа, то бросает исключение
			throw new Error('Объект должен быть типа Actor');
		}

	}
	
}



class Player extends Actor {
	constructor (pos) {
		super(pos);
		this.pos = pos;
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


























