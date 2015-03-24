{
    init: function(elevators, floors) {
        elevators.forEach(function (elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.destinationQueue.push(floorNum);
            });
        });
        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                elevators[0].destinationQueue.push(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                elevators[0].destinationQueue.push(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) { }
}