angular.module('angularify.semantic.accordion', [])

.controller('AccordionController', ['$scope', function($scope){
	this.accordions = [];
	this.add_accordion = function(scope) {
		this.accordions.push(scope);
		var _this = this;
		scope.$on('$destroy', function(event){
			_this.remove_accordion(scope);
		});
		return this.accordions;
	}
	this.remove_accordion = function(scope){
		var index = this.accordions.indexOf(scope);
		if ( index != -1 ) {
			this.accordions.splice(index, 1);
		}
	 }
	 this.closeAll = function(){

	 }
}])
.directive('uiAccordion', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		controller: 'AccordionController',
		scope: {
		  },
		template: '<div class="ui styled accordion" ng-transclude></div>',

		link: function(scope, element, attrs, AccordionController){
			AccordionController.add_accordion(scope);
		}
	}
})
.directive('uiAccordionGroup', ['$animateCss', function($animateCss) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope : {
			title:  '@',
		},
		require:'^uiAccordion',
       		template: '<div class="ui">' + 
            			'<div class="title" ng-class="{ active: active }" ng-click="click_on_accordion_tab()">' +
                		'<i class="dropdown icon"></i>' +
                 		'{{ title }}' + 
 			'</div>' +
                		'<div class="content" ng-transclude>' +
                		'</div>' +
                		'</div>',

		link: function(scope, element, attrs, AccordionController){

			scope.active = false;

			AccordionController.add_accordion(scope);

			var elementLastChildren = element.children().eq(-1);
			var elementFirstChildren = element.children().eq(0);

			scope.click_on_accordion_tab = function(){
				var slideHeight = getHeight(elementLastChildren) + elementFirstChildren[0].offsetHeight;
				if(scope.active){
					collapse();
				}else{
					expand(slideHeight);
				}
			};
			
			function expand(slideHeight){
            				scope.active = true;
            				element.css({overflow : 'hidden'});
            				elementLastChildren.addClass('active');
				$animateCss(element, {
					easing: 'ease',
					from : {height : elementFirstChildren[0].clientHeight + 'px'},
					to: { height: slideHeight + 'px'},
					duration : .3
				}).start()['finally'](expandDone);
			};
			function expandDone(){
				element.css({height : 'auto',overflow : ''})
			};
			function collapse(){
				scope.active = false;
				element.css({overflow : 'hidden'});
				$animateCss(element, {
					easing: 'ease',
					from : {height : element[0].clientHeight + 'px'},
					to: {height: elementFirstChildren[0].clientHeight + 'px'},
					duration : .3
				}).start()['finally'](collapseDone);
			};
			function collapseDone(){
				element.css({height : 'auto', overflow : ''});
				elementLastChildren.removeClass('active');
			};
			function getHeight(elem){
				var targetHeight = 0;
				elem.css({display : 'block', visibility : 'hidden' });
				targetHeight = elem[0].offsetHeight;
				elem.css({display : '', visibility : ''});
				return targetHeight;
			};
		}
	};
}]);

// 改成watch ?