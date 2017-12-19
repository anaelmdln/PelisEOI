(function () {
	'use strict';
	angular.module('PelisEOI').factory('MainFactory', MainFactory);

	MainFactory.inject = ['$location'];

	function MainFactory($location) {
		let view = {
			name: '',
			film_detail: false,
			loading: false,
			user: {}
		};
		// if ('user' in localStorage)
		// 	view.user = JSON.parse(localStorage.getItem('user'));
		// else
		// 	view.user = {};

		let service = {
			view: view,
			getFrom: getFrom,
			push: push,
			remove: remove,
			signout: signout,
			signin: signin,
			signup: signup,
			checkAuth: checkAuth
		}

		return service;

		function getUser(callback) {
			return firebase.database().ref('users/' + view.auth).child('lists').on('value', items => callback(items.val()));
		}

		function getFrom(from, callback) {
			return firebase.database().ref('users/' + view.auth).child('lists/' + from).on('value', items => callback(format(items.val())));
		}

		function push(from, item) {
			return firebase.database().ref('users/' + view.auth).child('lists/' + from).push(item);
		}

		function remove(from, id) {
			return firebase.database().ref('users/' + view.auth).child('lists/' + from + '/' + id).remove();
		}

		function checkAuth(postInit) {
			return firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					view.auth = user.uid;
					getUser((items) => {
						if (items && items.favorites)
							view.user.favorites = format(items.favorites);
						else
							view.user.favorites = [];

						if (items && items.watchLater)
							view.user.watchLater = format(items.watchLater);
						else
							view.user.watchLater = [];

						if (items && items.watched)
							view.user.watched = format(items.watched);
						else
							view.user.watched = [];
					}); 
					postInit();
				} else {
					$location.path("/login");
				}
			});
		}

		function signin(email, password) {
			return firebase.auth().signInWithEmailAndPassword(email, password).then((auth) => {
				view.auth = auth.uid;
			}).catch(function(error) {
				console.error('Error:', error.code, error.message);
			});
		}

		function signup() {
			let email = vm.input.email;
			let password = vm.input.password;
			return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				console.error('Error:', error.code, error.message);
			});
		}

		function signout() {
			return firebase.auth().signOut().catch(function(error) {
				console.error('Error:', error.code, error.message);
			});
		}

		function format(data) {
			if (data) {
				return Object.keys(data).map(key => {
					data[key]['firebase_id'] = key;
					return data[key];
				});
			} else {
				return data;
			}
		}

		function unformat(data) {
			if (data) {
				return data.map(value => {
					let obj = {};
					let key = value['firebase_id'];
					obj[key] = value;
					delete obj[key].id;
					delete obj[key].$$hashKey;
					return obj;
				});
			} else {
				return data;
			}
		}

	}
})();