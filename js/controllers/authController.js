(function () {
	'use strict';
	angular.module('PelisEOI').controller('AuthController', AuthController);

	AuthController.inject = ['MainFactory', '$scope', '$location'];
	
	function AuthController(MainFactory, $scope, $location) {
		let vm = this;

		MainFactory.view.name = 'login';
		MainFactory.view.search = '';
		vm.show = 'Signin';
		vm.signup = signup;
		vm.signin = signin;
		vm.apply = apply;

		init();

		function init() {
		}

		function signup() {
			let email = vm.input.email;
			let password = vm.input.password;
			MainFactory.signup(email, password).then(() => {
				vm.apply(() => {
					vm.show = 'Signin';
				});
			}).catch(function(error) {
				vm.apply(() => {
					vm.show = 'Signin';
				});
			});
		}

		function signin() {
			let email = vm.input.email;
			let password = vm.input.password;
			MainFactory.signin(email, password).then((auth) => {
				vm.apply(() => {
					$location.path("/");
				});
			});;
		}

		function apply(func) {
			$scope.$applyAsync(func());
		}

	}
})();