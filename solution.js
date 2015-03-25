{
    init: function(elevators, floors) {
        elevators.forEach(function (elevator) {
            /* Add the new `floorNum` to the destination queue in a sensible manner:
             *   if the `floorNum` is already in the queue, skip;
             *   if the `floorNum` is along the way, make a stop when passing it;
             *   otherwise, add to the end of the queue.
             */
            elevator.addToDestinationQueue = function(floorNum) {
                if (this.destinationQueue.indexOf(floorNum) >= 0) {
                    return;
                }
                if (this.destinationQueue.length === 0) {
                    this.goToFloor(floorNum);
                    return;
                }
                var currentFloor = this.currentFloor();
                var nextIndex = 0;
                if (this.destinationQueue[0] === currentFloor) {
                    nextIndex = 1;
                    if (this.destinationQueue.length === 1) {
                        this.goToFloor(floorNum);
                        return;
                    }
                }
                var direction = this.destinationQueue[nextIndex] - currentFloor;
                var index;
                if (direction > 0) {
                    if (floorNum > currentFloor) {
                        index = _.findIndex(this.destinationQueue, function (f) { return f > floorNum; });
                        if (index < 0) {
                            index = _.findIndex(this.destinationQueue, function (f) { return f < currentFloor; });
                        }
                    } else {
                        index = _.findIndex(this.destinationQueue, function (f) { return f < floorNum; });
                    }
                } else {
                    if (floorNum < currentFloor) {
                        index = _.findIndex(this.destinationQueue, function (f) { return f < floorNum; });
                        if (index < 0) {
                            index = _.findIndex(this.destinationQueue, function (f) { return f > currentFloor; });
                        }
                    } else {
                        index = _.findIndex(this.destinationQueue, function (f) { return f > floorNum; });
                    }
                }
                if (index >= 0) {
                    this.destinationQueue.splice(index, 0, floorNum);
                } else {
                    this.destinationQueue.push(floorNum);
                }
                this.checkDestinationQueue();
            }
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.addToDestinationQueue(floorNum);
            });
        });
        /* Select an elevator for a given floor request. */
        var selectElevator = function (floorNum, direction) {
            return(elevators[Math.floor(Math.random() * elevators.length)]);
        }
        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                var elevator = selectElevator(floor.floorNum(), "up");
                elevator.addToDestinationQueue(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                var elevator = selectElevator(floor.floorNum(), "down");
                elevator.addToDestinationQueue(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) { }
}
