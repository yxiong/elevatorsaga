{
    init: function(elevators, floors) {
        var firstIndexBiggerThan = function(array, value, start) {
            if (typeof start === "undefined") {
                start = 0;
            }
            for (var i = start; i < array.length; i++) {
                if (array[i] > value) {
                    return i;
                }
            }
            return -1;
        }
        var firstIndexSmallerThan = function(array, value, start) {
            if (typeof start === "undefined") {
                start = 0;
            }
            for (var i = start; i < array.length; i++) {
                if (array[i] < value) {
                    return i;
                }
            }
            return -1;
        }
        var addToDestinationQueue = function(elevator, floorNum) {
            console.log("================");
            console.log("currentFloor: " + elevator.currentFloor());
            console.log("currentQueue: " + elevator.destinationQueue);
            console.log("destinationFloor: " + floorNum);
            if (elevator.destinationQueue.indexOf(floorNum) >= 0) {
                console.log("newQueue:" + elevator.destinationQueue);
                return;
            }
            if (elevator.destinationQueue.length === 0) {
                elevator.destinationQueue.push(floorNum);
                elevator.checkDestinationQueue();
                console.log("newQueue:" + elevator.destinationQueue);
                return;
            }
            var currentFloor = elevator.currentFloor();
            var nextIndex = 0;
            if (elevator.destinationQueue[0] === currentFloor) {
                nextIndex = 1;
                if (elevator.destinationQueue.length === 1) {
                    elevator.destinationQueue.push(floorNum);
                    elevator.checkDestinationQueue();
                    console.log("newQueue:" + elevator.destinationQueue);
                    return;
                }
            }
            var direction = elevator.destinationQueue[nextIndex] - currentFloor;
            if (direction > 0) {
                if (floorNum > currentFloor) {
                    var index = firstIndexBiggerThan(elevator.destinationQueue, floorNum, nextIndex);
                    if (index < 0) {
                        index = firstIndexSmallerThan(elevator.destinationQueue, currentFloor, nextIndex);
                    }
                } else {
                    var index = firstIndexSmallerThan(elevator.destinationQueue, floorNum, nextIndex);
                }
            } else {
                if (floorNum < currentFloor) {
                    var index = firstIndexSmallerThan(elevator.destinationQueue, floorNum, nextIndex);
                    if (index < 0) {
                        index = firstIndexBiggerThan(elevator.destinationQueue, currentFloor, nextIndex);
                    }
                } else {
                    var index = firstIndexBiggerThan(elevator.destinationQueue, floorNum, nextIndex);
                }
            }
            if (index >= 0) {
                elevator.destinationQueue.splice(index, 0, floorNum);
            } else {
                elevator.destinationQueue.push(floorNum);
            }
            elevator.checkDestinationQueue();
            console.log("newQueue:" + elevator.destinationQueue);
        }
        var selectElevator = function (floorNum, direction) {
            return(elevators[Math.floor(Math.random() * elevators.length)]);
        }
        elevators.forEach(function (elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {
                addToDestinationQueue(elevator, floorNum);
            });
        });
        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                var elevator = selectElevator(floor.floorNum(), "up");
                addToDestinationQueue(elevator, floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                var elevator = selectElevator(floor.floorNum(), "down");
                addToDestinationQueue(elevator, floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) { }
}
