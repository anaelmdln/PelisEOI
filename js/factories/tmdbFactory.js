(function () {
	'use strict';
	angular.module('PelisEOI').factory('TmdbFactory', TmdbFactory);

	TmdbFactory.inject = ['$http'];

	function TmdbFactory($http) {
		let themoviedb = 'https://api.themoviedb.org/3';
		let omdb = 'https://www.omdbapi.com/?&apikey=' + PelisEOIConfig.omdb;
		let language = 'es';
		let keyAndConfig = '?language=' + language + '&region=' + language + '&api_key=' + PelisEOIConfig.the_movie_db;
		// let url = 'http://www.omdbapi.com/?i=tt3896198&apikey=';
		// ?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
		// ?sort_by=popularity.desc

		let service = {
			getFilm: getFilm,
			getFilms: getFilms,
			getSimilarFilms: getSimilarFilms,
			getSubtitles: getSubtitles,
			getFilteredFilms: getFilteredFilms,
			getUpcomingFilms: getUpcomingFilms,
			getRatingFromOmdb: getRatingFromOmdb,
			searchFilms: searchFilms,
			getCategories: getCategories
		};

		return service;

		function getSubtitles(id) {
			console.log(id);
			const OpenSubtitles = require('opensubtitles-api');
			const OS = new OpenSubtitles('TemporaryUserAgent');
			return OS.login()
			.then(res => {
				return OS.search({
					imdbid: id,
					sublanguageid: 'spa',
					gzip: true
				}).catch(console.error);
			})
			.catch(err => {
				console.log(err);
			});
		}

		function getFilm(id) {
			let url = themoviedb + '/movie/' + id + keyAndConfig + '&append_to_response=videos';
			return $http.get(url);
		}

		function getSimilarFilms(id) {
			let url = themoviedb + '/movie/' + id + '/similar' + keyAndConfig;
			return $http.get(url);
		}

		function getFilms(page) {
			let url = themoviedb + '/movie/popular' + keyAndConfig + '&page=' + page;
			return $http.get(url);
		}

		function getFilteredFilms(page, filters) {
			let url = themoviedb + '/discover/movie' + keyAndConfig + '&page=' + page;
			if (filters.min_year)
				url += '&release_date.gte=' + filters.min_year + '-01-01';
			if (filters.max_year)
				url += '&release_date.lte=' + filters.max_year + '-12-31';
			if (filters.min_rate)
				url += '&vote_average.gte=' + (filters.min_rate / 10);
			if (filters.max_rate)
				url += '&vote_average.lte=' + (filters.max_rate / 10);
			if (filters.category)
				url += '&with_genres=' + filters.category;
			if (filters.order_by)
				url += '&sort_by=' + filters.order_by;
			return $http.get(url);
		}

		function searchFilms(page, search) {
			let url = themoviedb + '/search/movie' + keyAndConfig + '&page=' + page + '&query=' + search;
			return $http.get(url);
		}

		function getUpcomingFilms(page) {
			let url = themoviedb + '/movie/upcoming' + keyAndConfig + '&page=' + page;
			return $http.get(url);
		}

		function getCategories() {
			let url = themoviedb + '/genre/movie/list' + keyAndConfig;
			return $http.get(url);
		}

		function getRatingFromOmdb(id) {
			let url = omdb + '&i=' + id;
			return $http.get(url);
		}

	}
})();