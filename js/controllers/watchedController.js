(function () {
	'use strict';
	angular.module('PelisEOI').controller('WatchedController', WatchedController);

	WatchedController.inject = ['MainFactory', 'TmdbFactory', '$scope'];
	
	function WatchedController(MainFactory, TmdbFactory, $scope) {
		let vm = this;

		MainFactory.view.name = 'watched';
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
			MainFactory.getFrom('watched', (items) => {
				$scope.$applyAsync(() => {
					vm.films = items;
				})
			});
		}

		function getFilm(id) {
			TmdbFactory.getFilm(id).then(data => {
				MainFactory.view.film_detail = data.data;
				TmdbFactory.getRatingFromOmdb(data.data.imdb_id).then(data => {
					MainFactory.view.film_detail.rating = data.data.Ratings;
				});
			});
			TmdbFactory.getSimilarFilms(id).then(data => {
				console.log(data);
				MainFactory.view.related_films = data.data.results;
			});
		}

	}
})();