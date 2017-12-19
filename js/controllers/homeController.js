(function () {
	'use strict';
	angular.module('PelisEOI').controller('HomeController', HomeController);

	HomeController.inject = ['MainFactory', 'TmdbFactory'];
	
	function HomeController(MainFactory, TmdbFactory) {
		let vm = this;

		MainFactory.view.name = 'home';
		MainFactory.view.search = '';
		let filter_default = {
			min_year: 1900,
			max_year: 2017,
			min_rate: 0,
			max_rate: 100,
			category: undefined,
			order_by: 'popularity.desc'
		};
		vm.total = '0';
		vm.page = 1;
		vm.films = [];
		vm.film_deatil = {};
		vm.filter_applies = false;
		let filter = {};
		vm.filter = filter;

		vm.getFilm = getFilm;
		vm.applyFilter = applyFilter;
		vm.removeFilter = removeFilter;
		vm.changeCategory = changeCategory;
		let timer = null;


		vm.filter_year = {
			minValue: filter_default.min_year,
			maxValue: filter_default.max_year,
			options: {
				floor: filter_default.min_year,
				ceil: filter_default.max_year,
				step: 1,
				onChange: function () {
					applyFilter();
				}
			}
		};

		vm.filter_rate = {
			minValue: filter_default.min_rate,
			maxValue: filter_default.max_rate,
			options: {
				floor: filter_default.min_rate,
				ceil: filter_default.max_rate,
				step: 1,
				onChange: function () {
					applyFilter();
				}
			}
		};

		vm.orders = [
		{name:'Popularity', order:'up', value:'popularity.asc'},
		{name:'Popularity', order:'down', value:'popularity.desc'},
		{name:'Release date', order:'up', value:'release_date.asc'},
		{name:'Release date', order:'down', value:'release_date.desc'},
		{name:'Revenue', order:'up', value:'revenue.asc'},
		{name:'Revenue', order:'down', value:'revenue.desc'},
		{name:'Primary release date', order:'up', value:'primary_release_date.asc'},
		{name:'Primary release date', order:'down', value:'primary_release_date.desc'},
		{name:'Original title', order:'up', value:'original_title.asc'},
		{name:'Original title', order:'down', value:'original_title.desc'},
		{name:'Vote average', order:'up', value:'vote_average.asc'},
		{name:'Vote average', order:'down', value:'vote_average.desc'},
		{name:'Vote count', order:'up', value:'vote_count.asc'},
		{name:'Vote count', order:'down', value:'vote_count.desc'},
		];

		init();

		function init() {
			MainFactory.checkAuth(postInit);
		}

		function postInit() {
			vm.filter = JSON.parse(JSON.stringify(filter_default));
			getFilmsAndShowLoading()
			getCategories();
			$(window).scroll(function() {
				if($(window).scrollTop() + $(window).height() == $(document).height()) {
					vm.page += 1;
					getFilmsAndShowLoading()
				}
			});
		}

		function changeCategory(categoryId) {
			vm.filter.category = categoryId;
			applyFilter();
		}

		function applyFilter(key, value) {
			if(timer) {
				clearTimeout(timer);
				timer = null
			}
			timer = setTimeout(function() {
				vm.filter_applies = true;
				vm.page = 1;
				vm.films = [];
				getFilmsAndShowLoading()
			}, 300);
		}

		function removeFilter() {
			vm.filter_applies = false;
			vm.page = 1;
			vm.films = [];
			vm.filter = JSON.parse(JSON.stringify(filter_default));
			getFilmsAndShowLoading()
		}

		function getFilmsAndShowLoading() {
			MainFactory.view.loading = true;
			getFilms().then((res) => MainFactory.view.loading = false);
		}

		function getFilms() {
			if (vm.filter_applies === true) {
				return TmdbFactory.getFilteredFilms(vm.page, vm.filter).then(data => {
					vm.films = vm.films.concat(data.data.results);
					vm.total = data.data.total_results;
				});
			} else {
				return TmdbFactory.getFilms(vm.page).then(data => {
					vm.films = vm.films.concat(data.data.results);
					vm.total = data.data.total_results;
				});
			}
		}

		function getCategories() {
			TmdbFactory.getCategories().then(data => {
				vm.categories = data.data.genres;
			});
		}

		function getFilm(id) {
			TmdbFactory.getFilm(id).then(data => {
				MainFactory.view.film_detail = data.data;
				TmdbFactory.getRatingFromOmdb(data.data.imdb_id).then(data => {
					MainFactory.view.film_detail.rating = data.data.Ratings;
				});
			});
		}

	}
})();