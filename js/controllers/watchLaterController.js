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
				TmdbFactory.getRatingFromOmdb(data.data.imdb_id).then(data => {
					MainFactory.view.film_detail.rating = data.data.Ratings;
				});
				TmdbFactory.getSubtitles(data.data.imdb_id).then(data => {
					$scope.$applyAsync(() => {
						MainFactory.view.subtitles = data.es.url;
					});
				});
			});
			TmdbFactory.getSimilarFilms(id).then(data => {
				MainFactory.view.related_films = data.data.results;
			});
		}

	}
})();