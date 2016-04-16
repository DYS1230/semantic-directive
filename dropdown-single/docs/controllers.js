
angular
  .module('dropdownApp', ['ngAnimate','angularify.semantic.dropdown'])
  .controller('RootCtrl', RootCtrl)
  .filter('allowHtml', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

function RootCtrl ($scope) {
    $scope.dropdown_model = 'item3';


    $scope.dropdown_items = [
      'f1',
      'f2',
      'f3',
      'f4'
    ];

    $scope.dropdown_key_value_model = '';
    $scope.dropdown_key_value_items = {
      'item1': 'Cool item 1',
      'item2': 'Cool item 2',
      'item3': 'Cool item 3',
      'item4': 'Cool item 4'
    };


}

