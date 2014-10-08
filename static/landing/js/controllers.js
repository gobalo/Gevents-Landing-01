/**
 * Module Events: compuesto de 2 controladores.
 * ngSanitize: https://docs.angularjs.org/api/ngSanitize/service/$sanitize
 * google-maps: https://angular-ui.github.io/angular-google-maps/
 * angularUI: http://angular-ui.github.io/
 * 
 * Para que funcione este módulo y sus controladores hay que llamarlo desde app.js
 * */

angular.module('events', ['eventService', 'google-maps','ngSanitize'])
.controller('eventController', ['$scope','$http', '$log', 'sharedEvent', function ($scope, $http, $log, sharedEvent) {
	/**
	 * Inicializar events
	 */
	//http://dev.gobalo. es:888/
	//https://test-django-cloud-sql-1234.appspot.com/
	$scope.event = {};
	$http.get('https://test-django-cloud-sql-1234.appspot.com/api/events/1').
    success(function(data, status, headers, config) {
		/* Si se recupera más de un evento se muestran para seleccionar. Si Solo es uno se carga contra el servicio sharedEvent */
		if(data.length > 0 && data.length !== undefined){
	        $scope.events = data;
		}else{
			coords = data.google_maps_coords.split(',');
	    	sharedEvent.event = data;
	    	sharedEvent.map = {center: {latitude: coords[0], longitude: coords[1]}, zoom:15 };
	    	$scope.event = data;
	    	$('#content_preload').hide()
		}
	  }).
	  error(function(data, status, headers, config) {
		    console.log(data);
		    console.log(status);
		    console.log(headers);
		    console.log(config);
		});
	/*
	  $scope.setRegisterEvent = function(event) {
		  sharedEvent.event = event;
		  console.log(sharedEvent.event);
	  };
	  */
}])
.controller('attendeeController', ['$scope','$http', '$log' , 'sharedEvent', function($scope, $http, $log, sharedEvent) {
	console.log($scope.event);
	$scope.event = [];
	$scope.event = sharedEvent;
	$scope.event.map = {center: {latitude: '51.219053', longitude: '-4.402323' }, zoom: 5 };
	/**
	 * Muestra si hubo un error en el envío(false) o la confirmación (true)
	 */
	$scope.result_register = false;
	/**
	 * Muestra el resultado del envío
	 */
	$scope.finish_sending = false;
	/**
	 * Muestra mensaje de "se está enviadno"
	 */
	$scope.is_sending_register = false;
	/**
	 * Inicializar attendee
	 */
	$scope.attendee = {};
	$scope.attendee.id = "";
	/**
	 * For tests
	 */
	$scope.attendee.name = "Alberto";
	$scope.attendee.surname = "test2";
	$scope.attendee.email = "test2@gmail.com";
    $scope.submit = function() {
    	/**
    	 * Mostramos el mensaje de "se está madnando"
    	 */
    	$scope.is_sending_register = true;
    	/**
    	 * Preparamos nuestros datos para el modelo de la API
    	 */
    	$scope.attendee.event = $scope.event.event.id;
    	$scope.attendee.answers = [];
    	$scope.event.event.questions.forEach(function(question) {
    	    $scope.attendee.answers.push({
    	    	question: question.id,
    	    	answer: question.answer
    	    })
    	});
    	//return false;
    	/**
    	 * Enviamos los datos a la API
    	 */
    	$http.post('https://test-django-cloud-sql-1234.appspot.com/api/attendees/', $scope.attendee)
            .success(function(data) {
            	console.log(data);
            	$scope.is_sending_register = false;
            	$scope.finish_sending = true;
            	$scope.result_register = data.result;
            	$scope.result_error_msg = data.error_msg;
            	$scope.attendee = data;
            }).
            error(function(data, status, headers, config) {
            	$scope.is_sending_register = false;
            	$scope.finish_sending = true;
            	$scope.result_register = data.result;
            	$scope.result_error_msg = data.error_msg;
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
    }
	$scope.reset = function() {
		$scope.attendee = angular.copy($scope.master);
	};
}]);