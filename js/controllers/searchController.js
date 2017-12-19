(function () {
	'use strict';
	angular.module('PelisEOI').controller('SearchController', SearchController);

	SearchController.inject = ['MainFactory', 'TmdbFactory', '$scope'];
	
	function SearchController(MainFactory, TmdbFactory, $scope) {
		let vm = this;

		MainFactory.view.name = 'search';
		vm.total = '0';
		vm.films = [];
		vm.film_deatil = {};
		let timer = null;

		vm.getFilm = getFilm;
		vm.search = postInit;

		init();

		function init() {
			MainFactory.checkAuth(postInit);
		}

		function postInit() {
			getFilms(1);
			MainFactory.view.on_search = getFilms;
		}

		function getFilms(page) {
			if(timer) {
				clearTimeout(timer);
				timer = null
			}
			timer = setTimeout(function() {
				vm.filter_applies = true;
				vm.page = 1;
				vm.films = [];
				TmdbFactory.searchFilms(page, MainFactory.view.search).then(data => {
					vm.films = data.data.results;
					vm.total = data.data.total_results;
				});
			}, 300);
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