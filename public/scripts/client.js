var myApp = angular.module("myApp", ["ngRoute"]);
myApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/gameBoard', {
            templateUrl: '/views/gameBoard.html',
            controller: 'GameBoardController'
        })
        .otherwise({
            redirectTo: 'gameBoard'
        });

}]);
