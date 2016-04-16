angular.module('angularify.semantic.dimmer', [])

.directive("uiPageDimmer", function () {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope : {
			model: '=ngModel'
		},
		template: '<div class="{{dimmer_class}}" ng-click="click_on_dimmer()">' +
					'<div class="content">' +
					'<div class="center" ng-transclude></div>' +
					'</div>' +
					'</div>',
		link : function(scope, element, attrs) {
			scope.click_on_dimmer = function(){
				scope.model = false;
			}
			scope.$watch('model', function(value){
				if (value == false || value == undefined)
					scope.dimmer_class = 'ui page dimmer';
				else
					scope.dimmer_class = 'ui page active dimmer';
			});
		}
	};
});
