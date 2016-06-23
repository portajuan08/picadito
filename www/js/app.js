// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        BackandProvider.setAppName('prueba1juan'); // change here to your app name
        BackandProvider.setSignUpToken('dbb66539-215b-43d4-a1de-97d78f579ed4'); //token that enable sign up. see http://docs.backand.com/en/latest/apidocs/security/index.html#sign-up
        BackandProvider.setAnonymousToken('c3c28af6-68ae-48b8-bffe-ed140cb26a46'); // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access

        $stateProvider
            // setup an abstract state for the tabs directive
	    .state('tablogin', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs-login.html'
            })
	    .state('tabpartido', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs-partido.html'
            })
	    .state('tabjugador', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs-jugador.html'
            })
	    .state('tabequipo', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs-equipo.html'
            })
            .state('tabpartido.partido', {
                url: '/partido',
                views: {
                    'panta-partido': {
                        templateUrl: 'templates/panta-partido.html',
                        controller: 'EquipoCtrl as vm'
                    }
                }
            })
            .state('tabjugador.jugador', {
                url: '/jugador',
                views: {
                    'panta-jugador': {
                        templateUrl: 'templates/panta-jugador.html',
                        controller: 'JugadorCtrl as jugador'
                    }
                }
            })
            .state('tabequipo.equipo', {
                url: '/equipo',
                views: {
                    'panta-equipo': {
                        templateUrl: 'templates/panta-equipo.html',
                        controller: 'EquipoCtrl as vm'
                    }
                }
            })
            .state('tablogin.registrar', {
                url: '/registrar',
                views: {
                    'panta-registrar': {
                        templateUrl: 'templates/panta-registrar.html',
                        controller: 'LoginCtrl as login'
                    }
                }
            })
            .state('tablogin.login', {
                url: '/login',
                views: {
                    'panta-login': {
                        templateUrl: 'templates/panta-login.html',
                        controller: 'LoginCtrl as login'
                    }
                }
            });

        $urlRouterProvider.otherwise('/tabs/login');

        $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            $state.go('tablogin.login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'tablogin.login') {
                signout();
            }
            else if (toState.name != 'tablogin.login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })

