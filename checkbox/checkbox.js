angular.module('angularify.semantic.checkbox', [])
.directive('uiCheckbox', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
        checked: '&?',
        disabled: '&?',
        ngModel: '=ngModel'
        },
        link: function(scope,element,attr) {
        if(angular.isFunction(scope.checked)) { 
            scope.ngModel = !!scope.checked(); 
        }
        scope.toggle = function() {
            if(angular.isFunction(scope.disabled) && scope.disabled()) return;
            scope.ngModel = !scope.ngModel;
        }
    },
    require: 'ngModel',
    template: '<div class="ui checkbox">' +
        '<input type="checkbox" ng-model="ngModel" ng-disabled="disabled()"/>' +
        '<label ng-click="toggle()" ng-transclude></label>' +
        '</div>',
  };
});
