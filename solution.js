{
    init: function(elevators, floors) {
        elevators.forEach(function (elevator) {
            /* Get the direction the elevator currently moves towards. Returns:
             *    a positive number if the elevator is moving upwards;
             *    a negative number if the elevator is moving downwards;
             *    zero if the elevator is not moving.
             */
            elevator.getDirection = function() {
                if (this.destinationQueue.length === 0) {
                    return 0;
                }
                var currentFloor = this.currentFloor();
                var nextFloor = this.destinationQueue[0];
                if (nextFloor === currentFloor) {
                    if (this.destinationQueue.length === 1) {
                        return 0;
                    }
                    nextFloor = this.destinationQueue[1];
                }
                return nextFloor - currentFloor;
            }
            /* Add the new `floorNum` to the destination queue in a sensible manner:
             *   if the `floorNum` is already in the queue, skip;
             *   if the `floorNum` is along the way, make a stop when passing it;
             *   otherwise, add to the end of the queue.
             */
            elevator.addToDestinationQueue = function(floorNum) {
                if (this.destinationQueue.indexOf(floorNum) >= 0) {
                    return;
                }
                var direction = this.getDirection();
                if (direction === 0) {
                    this.goToFloor(floorNum);
                    return;
                }
                var currentFloor = this.currentFloor();
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

/**
 * TODO:
 *   Better logic for selecting an elevator when a floor request is received.
 *   Add goingUpIndicator and goingDownIndicator.
 */

// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
