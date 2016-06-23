angular.module('SimpleRESTIonic.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('ItemsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'items/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }
		
	
        service.all = function () {
           return $http.get(getUrl());
        };

		  service.allId = function(id){
			  return $http({method:"GET",url:getUrl(), 
                       params:{filter:[{fieldName:"user", operator:"in", value:id}]}}); 
                      //headers: {"Authorization":userProfile.token}}); 
	 	  };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) { 
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };

        service.signout = function () {
            return Backand.signout();
        };

    })

    .service('JugadoresModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'users/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }
		
	
        service.all = function () {
           return $http.get(getUrl());
        };

	service.todosMenosId = function(id){
	   return $http({method:"GET",url:getUrl(), 
	   params:{filter:[{fieldName:"id", operator:"notEquals", value:id}]}}); 
	};

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.signout = function () {
            return Backand.signout();
        };

    })

    .service('LoginService', function ($http,Backand) {
        var service = this;

        service.currentUser = {};

        

        service.loadUserDetails = function () {	
            return Backand.getUserDetails()
                .then(function (data) {
                    service.currentUser.details = data;
                    if(data !== null){
                        service.currentUser.name = data.username;
                        service.currentUser.id = data.userId;
							}
                });

        }

        service.signin = function (email, password, appName) {
            //call Backand for sign in
		return Backand.signin(email, password);
        };

        service.signup = function (firstName, lastName, email, password, confirmpass, parametros) {
            //call Backand for sign up
				return  Backand.signup(firstName, lastName, email, password, confirmpass,parametros);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.changePassword = function (oldPassword, newPassword) {
            return Backand.changePassword(oldPassword, newPassword)
        };

        service.signout = function () {
            return Backand.signout();
        };
    });
