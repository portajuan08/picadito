angular.module('SimpleRESTIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();	
                }, function (error) {
                    login.error = error && error.data || error.error_description || 'Unknown error from server';
                })
        }

        function signup() {
		var parametros = {posicion: login.posicion || '', telefono: login.telefono || '', hincha: login.hincha || '', informacion: login.informacion || '',piepreferido: login.piepreferido || '', sexo: login.sexo || '', fechanac: login.fechanac || ''};
				LoginService.signup(login.firstName, login.lastName, login.email, login.password,login.confirmpass, parametros)
                .then(function () {
                    onLogin();
                }, function (error) {
                    login.error = error && error.data || error.error_description || 'Unknown error from server';
                })
        }

        function changePass() {
		login.error = null;
            	login.success = null;
		if (login.newPass != login.confPass) {
                	login.error = 'Password must match';
            	}else{
			LoginService.changePassword(login.oldPass, login.newPass)
			.then(function () {
			    login.newPass = null;
			    login.oldPass = null;
			    login.confPass = null;
		            login.success = 'Password was changed successfully.';
			}, function (error) {
			    login.error = error && error.data || error.error_description || 'Unknown error from server';
			})
		}
        }


        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
	    LoginService.loadUserDetails();
            $rootScope.$broadcast('authorized');
            $state.go('tabpartido.partido');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

	login.signup = signup;
        login.signin = signin;
        login.signout = signout;
	login.changePass = changePass;
        login.anonymousLogin = anonymousLogin;
    })

    .controller('JugadorCtrl', function (JugadoresModel, LoginService, $state,$rootScope) {
        var jugador = this;
	LoginService.loadUserDetails();
        jugador.currentUser = LoginService.currentUser;

        function getTodosJugadores() {
	    console.log('jugador id=>' + jugador.currentUser.id);
            JugadoresModel.todosMenosId(jugador.currentUser.id)
                .then(function (result) {
                    jugador.data = result.data.data;
                });
        }

        function clearData(){
            jugador.data = null;
        }

	$rootScope.signout = function() {
	    clearData();
            JugadoresModel.signout()
                .then(function () {
                    $rootScope.$broadcast('logout');
                    $state.go('tablogin.login');
                })
  			}

        jugador.objects = [];
        jugador.getTodosJugadores = getTodosJugadores;
        jugador.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            jugador.isAuthorized = true;
            getTodosJugadores();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });


	$rootScope.showjugadores = function(){
            $rootScope.$broadcast('authorized');
	     $state.go('tabjugador.jugador');
	}

        getTodosJugadores();

    })

    .controller('EquipoCtrl', function (ItemsModel, LoginService, $state,$rootScope) {
        var vm = this;

        vm.currentUser = LoginService.currentUser;

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.allId(vm.currentUser.id)
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
				object.user = vm.currentUser.id;
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
				object.user = vm.currentUser.id;
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

			$rootScope.signout = function() {
				clearData();
            ItemsModel.signout()
                .then(function () {
                    $rootScope.$broadcast('logout');
                    $state.go('tablogin.login');
                })
  			}

	$rootScope.showjugadores = function(){
            $rootScope.$broadcast('authorized');
	     $state.go('tabjugador.jugador');
		

	}

	$rootScope.showJugadores = function(){
            $rootScope.$broadcast('authorized');
	     $state.go('tabjugador.jugador');
	}

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    });

