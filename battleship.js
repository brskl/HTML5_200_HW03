// Move into model if possible
function Ship(size, name) {
  this.name = name;
  this.locations = null;
  this.hits = new Array(size);
  for (var i = 0; i < size; i++) {
    this.hits[i] = false
  }
}

var model = {
	boardSize: 7,
	shipsSunk: 0,

	ships: [
      new Ship(4, "Battleship Mississippi"),
      new Ship(3, "Cruiser Ohio"),
      new Ship(3, "Cruiser Maine"),
      new Ship(2, "Destroyer Florida")
      ],

	fire: function(guess) {
		for (var ship of this.ships) {
			var index = ship.locations.indexOf(guess);

			if (index >= 0) {
				ship.hits[index] = true;
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship! " + ship.name);
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (h of ship.hits)  {
			if (!h) {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var ship of this.ships) {
			do {
				locations = this.generateShip(ship.hits.length);
			} while (this.collision(locations));
			ship.locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function(shipLength) {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var ship of this.ships) {
            if (ship.locations != null) {
			   for (var j = 0; j < locations.length; j++) {
		            if (ship.locations.indexOf(locations[j]) >= 0) {
					   return true;
                    }
				}
			}
		}
		return false;
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},

    alreadyGuessed: function(location) {
        var cell = document.getElementById(location);
        return ((cell.getAttribute("class") === "hit") ||
                (cell.getAttribute("class") === "miss"));
    }

}; 

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
            if (view.alreadyGuessed(location)) {
                view.displayMessage("Oops, you already guessed that location!");
            } else {
		        this.guesses++;
                var hit = model.fire(location);
		        if (hit && model.shipsSunk === model.ships.length) {
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
		        }
            }
		}
	}
}


// helper function to parse a guess from the user

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// Submit handler

function handleFireButton() {
	var guessInput = document.guess.guessInput;
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";

    event.preventDefault();
}

// init - called when the page has completed loading

window.onload = init;

function init() {
	// place the ships on the game board
	model.generateShipLocations();
}





