(function () {
	'use strict';
	angular.module('PelisEOI').controller('MainController', MainController);

	MainController.inject = ['MainFactory', '$scope', '$location'];

	function MainController(MainFactory, $scope, $location) {
		let vm = this;
		vm.view = MainFactory.view;
		vm.signout = signout;
		vm.apply = apply;
		vm.search = search;

		init();

		function init() {
		}

		function search() {
			if (MainFactory.view.name !== 'search')
				$location.path( "/search" );
			if (MainFactory.view.on_search)
				MainFactory.view.on_search();
		}

		function signout() {
			MainFactory.signout().then(function() {
				vm.apply(() => {
					$location.path( "/login" );
				});
			});
		}

		function apply(func) {
			$scope.$applyAsync(func());
		}
	}
})();