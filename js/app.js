(function () {
	'use strict';
	angular.module('PelisEOI', ['ngRoute', 'rzModule']).config(config);

	config.$inject = ['$routeProvider'];

	function config($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'HomeController',
			templateUrl: './views/home.html',
			controllerAs: 'homeController',
			reloadOnSearch: false
		})
		.when('/login', {
			controller: 'AuthController',
			templateUrl: './views/auth.html',
			controllerAs: 'authController'
		})
		.when('/search', {
			controller: 'SearchController',
			templateUrl: './views/list.html',
			controllerAs: 'vmController'
		})
		.when('/coming_soon', {
			controller: 'ComingSoonController',
			templateUrl: './views/list.html',
			controllerAs: 'vmController'
		})
		.when('/my_favorites', {
			controller: 'MyFavoritesController',
			templateUrl: './views/list.html',
			controllerAs: 'vmController'
		})
		.when('/watch_later', {
			controller: 'WatchLaterController',
			templateUrl: './views/list.html',
			controllerAs: 'vmController'
		})
		.when('/watched', {
			controller: 'WatchedController',
			templateUrl: './views/list.html',
			controllerAs: 'vmController'
		});
	}

})();