(function () {
	'use strict';
	angular.module('PelisEOI').controller('ComingSoonController', ComingSoonController);

	ComingSoonController.inject = ['MainFactory', 'TmdbFactory'];
	
	function ComingSoonController(MainFactory, TmdbFactory) {
		let vm = this;

		MainFactory.view.name = 'comingSoon';
		MainFactory.view.search = '';
		vm.total = '0';
		vm.films = [];
		vm.film_deatil = {};

		vm.getFilm = getFilm;

		init();

		function init() {
			MainFactory.checkAuth(postInit);
		}

		function postInit() {
			getFilms(1);
		}

		function getFilms(page) {
			TmdbFactory.getUpcomingFilms(page).then(data => {
				vm.films = data.data.results;
				vm.total = data.data.total_results;
			});
		}

		function getFilm(id) {
			TmdbFactory.getFilm(id).then(data => {
				MainFactory.view.film_detail = data.data;
			});
			TmdbFactory.getSimilarFilms(id).then(data => {
				MainFactory.view.related_films = data.data.results;
			});
		}

	}
})();