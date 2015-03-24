{
    init: function(elevators, floors) {
        var addToDestinationQueue = function(elevator, floorNum) {
            if (elevator.destinationQueue.indexOf(floorNum) >= 0) {
                return;
            }
            if (elevator.destinationQueue.length === 0) {
                elevator.destinationQueue.push(floorNum);
                elevator.checkDestinationQueue();
                return;
            }
            var currentFloor = elevator.currentFloor();
            var nextIndex = 0;
            if (elevator.destinationQueue[0] === currentFloor) {
                nextIndex = 1;
                if (elevator.destinationQueue.length === 1) {
                    elevator.destinationQueue.push(floorNum);
                    elevator.checkDestinationQueue();
                    return;
                }
            }
            var direction = elevator.destinationQueue[nextIndex] - currentFloor;
            var index;
            if (direction > 0) {
                if (floorNum > currentFloor) {
                    index = _.findIndex(elevator.destinationQueue, function (f) { return f > floorNum; });
                    if (index < 0) {
                        index = _.findIndex(elevator.destinationQueue, function (f) { return f < currentFloor; });
                    }
                } else {
                    index = _.findIndex(elevator.destinationQueue, function (f) { return f < floorNum; });
                }
            } else {
                if (floorNum < currentFloor) {
                    index = _.findIndex(elevator.destinationQueue, function (f) { return f < floorNum; });
                    if (index < 0) {
                        index = _.findIndex(elevator.destinationQueue, function (f) { return f > currentFloor; });
                    }
                } else {
                    index = _.findIndex(elevator.destinationQueue, function (f) { return f > floorNum; });
                }
            }
            if (index >= 0) {
                elevator.destinationQueue.splice(index, 0, floorNum);
            } else {
                elevator.destinationQueue.push(floorNum);
            }
            elevator.checkDestinationQueue();
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
