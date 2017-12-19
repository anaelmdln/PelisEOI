(function () {
	'use strict';
	angular.module('PelisEOI').controller('WatchLaterController', WatchLaterController);

	WatchLaterController.inject = ['MainFactory', 'TmdbFactory', '$scope'];
	
	function WatchLaterController(MainFactory, TmdbFactory, $scope) {
		let vm = this;

		MainFactory.view.name = 'watchLater';
		MainFactory.view.search = '';
		vm.films = [];
		vm.film_deatil = {};

		vm.getFilm = getFilm;
		vm.user = MainFactory.view.user;

		init();

		function init() {
			MainFactory.checkAuth(postInit);
		}

		function postInit() {
			getFilms();
		}

		function getFilms(page) {
			MainFactory.getFrom('watchLater', (items) => {
				$scope.$applyAsync(() => {
					vm.films = items;
				})
			});
		}

		function getFilm(id) {
			TmdbFactory.getFilm(id).then(data => {
				MainFactory.view.film_detail = data.data;
			});
		}

	}
})();