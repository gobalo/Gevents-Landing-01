angular.module('eventService', [])
    .factory('sharedEvent', function () {
        return {
        	event: "",
        	map: [],
        };
});