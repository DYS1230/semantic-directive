var dimmerApp = angular.module('dimmerApp', ['angularify.semantic.dimmer']);
dimmerApp.controller('RootCtrl',['$scope',function RootCtrl($scope) {
    $scope.dimmer = function(){
        $scope.show_dimmer = true;
    };
}]);