'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.controller('PlanListCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', 'Plans', '$route', '$routeParams', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, Plans, $route, $routeParams, CONFIG) {

        $rootScope.loginStatus = false;
        $rootScope.user.name = localStorage.user_name;
        FingerprintF.calcelStatusAccess();
        $rootScope.user.dataurl = localStorage.user_dataurl;

        $scope.msg_btn_deletes = 'Mostrar Eliminados';
        var deletes = true;

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);

        // For pagination
        $scope.currentPage = 0;
        $scope.pageSize = 5;
        $scope.data = []; // initialize
        $scope.filtertext = "";

        $scope.sumCurrentPage = function () {
            $scope.currentPage = $scope.currentPage + 1;
        }

        $scope.lessCurrentPage = function () {
            $scope.currentPage = $scope.currentPage - 1;
        }


        $scope.numberOfPages = function () {

            if ($scope.data != undefined) {
                return Math.ceil($scope.data.length / $scope.pageSize);
            } else {
                return 0;
            }
        }
        // ##############



        $scope.getData = function ()
        {

            $scope.filtertext = "";

            if (deletes) {

                Plans.get(function (data)
                {
                    $scope.msg_btn_deletes = 'Mostrar Eliminados';
                    deletes = false;
                    $scope.data = data.plans;
                });

            } else {

                $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/planes_con_eliminados")
                        .success(function (response) {
                            $scope.msg_btn_deletes = 'Ocultar Eliminados';
                            deletes = true;
                            $scope.data = response.plans;

                        });

            }

        }

        $scope.getData();

        $scope.remove = function (id)
        {
            Plans.delete({id: id}).$promise.then(function (data) {
                if (data.msg)
                {
                    $route.reload();
                }
            });
        }

        $scope.find = function ()
        {

            var $urlfilter = "";
            $scope.msg_btn_deletes = 'Mostrar Eliminados';
            deletes = false;

            if ($.trim($scope.filtertext) != "") {
                $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/planes_con_filtro/" + $scope.filtertext
            } else {
                $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/planes_con_filtro";
            }

            $http.get($urlfilter)
                    .success(function (response) {
                        $scope.data = response.plans;
                    });

        }

    }]);






appGimnasio.controller('PlanShowCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', '$routeParams', 'Plans', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, $routeParams, Plans, CONFIG) {

        $rootScope.loginStatus = false;

        $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
        $rootScope.user.dataurl = localStorage.user_dataurl;
        $scope.settings = {
            pageTitle: "Detalle Plan",
            action: "Show",
            success: false,
            processing: false
        };

        var id = $routeParams.id;


        Plans.get({id: id}, function (data)
        {

            data.plan.duration = parseInt(data.plan.duration);
            data.plan.value = parseFloat(data.plan.value);
            $scope.plan = data.plan;

        });


        $scope.isEdit = function () {
            return false;
        }

        $scope.isShow = function () {
            return true;
        }


    }]);










appGimnasio.controller('PlanCreateCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Plans', 'ServicePathDomain', 'CONFIG', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Plans, ServicePathDomain, CONFIG) {

        $rootScope.loginStatus = false;

        $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
        $rootScope.user.dataurl = localStorage.user_dataurl;

        $scope.settings = {
            pageTitle: "Nuevo Plan",
            action: "New",
            success: false,
            processing: false
        };

        $scope.validateTheForm = true;
        $scope.formatNumberValue = 0;


        $scope.plan = {
            special_plan: "No",
            name: "",
            duration: 1,
            value: 0,
            description: ""

        };


        $scope.submit = function (form) {

            $scope.settings.processing = true;
            $scope.settings.success = false;
            $scope.validateTheForm = true;
            $timeout(function () {
                $scope.validateTheForm = form.$valid
            }, 1000);

            $timeout(function () {
                if (form.$valid) {

                    $scope.settings.processing = true;
                    Plans.save($scope.plan).$promise
                            .then(function (data)
                            {
                                if (data.msg)
                                {
                                    $location.path("/planes");
                                }
                                $scope.settings.processing = false;

                            }).catch(function (data)
                    {
                        $scope.settings.processing = false;
                        $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
                    });

                } else {
                    $scope.settings.processing = false;
                }
            }, 1000);

        }


        $scope.isEdit = function () {
            return false;
        }

        $scope.isShow = function () {
            return false;
        }

    }]);



appGimnasio.controller('PlanEditCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Plans', 'ServicePathDomain', 'CONFIG', '$routeParams', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Plans, ServicePathDomain, CONFIG, $routeParams) {

        $rootScope.loginStatus = false;

        $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
        $rootScope.user.dataurl = localStorage.user_dataurl;

        $scope.settings = {
            pageTitle: "Editar Plan",
            action: "Edit",
            success: false,
            processing: false
        };

        var id = $routeParams.id;

        $scope.validateTheForm = true;
        $scope.formatNumberValue = 0;



        Plans.get({id: id}, function (data)
        {
            
            data.plan.duration = parseInt(data.plan.duration);
            data.plan.value = parseFloat(data.plan.value);
            $scope.plan = data.plan;


        });




        $scope.submit = function (form) {

            $scope.settings.processing = true;
            $scope.settings.success = false;
            $scope.validateTheForm = true;
            $timeout(function () {
                $scope.validateTheForm = form.$valid
            }, 1000);

            $timeout(function () {
                if (form.$valid) {

                    $scope.settings.processing = true;
                    Plans.update({id: id}, $scope.plan).$promise
                            .then(function (data)
                            {
                                if (data.msg)
                                {
                                    $scope.settings.success = "Plan Editado correctamente";
                                }
                                $scope.settings.processing = false;

                            }).catch(function (data)
                    {
                        $scope.settings.processing = false;
                        $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
                    });

                } else {
                    $scope.settings.processing = false;
                }
            }, 500);

        }



        $scope.isEdit = function () {
            return true;
        }

        $scope.isShow = function () {
            return false;
        }

    }]);
