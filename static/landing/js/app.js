var app = angular.module('eventApp', ['ngRoute', 'ngResource', 'events']);

app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('{$');
	$interpolateProvider.endSymbol('$}');
});