(function() {
	'use strict';
	angular.module('PelisEOI').component('filmComponent', {
		templateUrl: './js/components/filmComponent/filmComponent.html',
		controller: filmComponent,
		controllerAs: 'filmComponent'
	});

	filmComponent.inject = ['TmdbFactory', 'MainFactory', '$sce'];

	function filmComponent(TmdbFactory, MainFactory, $sce) {
		let vm = this;
		vm.add = add;
		vm.remove = remove;
		vm.getIndex = getIndex;
		vm.getIframe = getIframe;
		vm.close = close;
		vm.view = MainFactory.view;
		vm.user = {};
		init();

		function init() {
			$(document).keyup(function(e) {
				if (e.keyCode == 27) {
					$("a.close").click();
				}
			});
		}

		function getIndex(from, film) {
			if (!vm.view.user[from]) return -1;
			return vm.view.user[from].findIndex(item => item.id == film.id);
		}

		function getIframe(videoId) {
			return $sce.trustAs($sce.RESOURCE_URL, 'https://www.youtube.com/embed/' + videoId);
		};

		function close() {
			MainFactory.view.film_detail = undefined;
		};

		function add(from, film) {
			console.log(film);
			if (!vm.view.user[from]) vm.view.user[from] = [];
			let index = getIndex(from, film);
			if (index !== -1) return null;
			MainFactory.push(from, {
				id: film.id,
				poster_path: film.poster_path,
				vote_average: film.vote_average,
				vote_count: film.vote_count
			});
		}

		function remove(from, film) {
			if (!vm.view.user[from]) vm.view.user[from] = [];
			let index = getIndex(from, film);
			MainFactory.remove(from, vm.view.user[from][index].firebase_id);
		}
	}
})();