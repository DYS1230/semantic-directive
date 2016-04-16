angular.module('angularify.semantic.dropdown', [])

.directive('uiDropdownMeau', ['$animateCss', function($animateCss){
	return {
		restrict : 'E',
		replace : true,
		transclude : true,
		scope : {
			placeholder : '@exPlaceholder',
		},
		template: '<div class="ui dropdown" tabindex="-1">' +
			'<div class="text">{{ placeholder }}</div>' +
			'<i class="dropdown icon"></i>' +
			'<div class="menu transition hidden" ng-transclude>' +
			'</div>' +
			'</div>',
		link: function(scope, element, attrs){
			scope.isOpen = false;
			var elementLastChildren = element.children().eq(-1);
			var childrenLength = elementLastChildren.children().length;

			element.bind('click', function(){
				if(scope.isOpen){
					scope.$apply(function(){
						collapse();
					});       
				}else{
					scope.$apply(function(){
						var slideHeight = getHeight(elementLastChildren);
						expand(slideHeight);
					});         
				}
				scope.isOpen = !scope.isOpen;
			});
			element.bind('blur', function(){
				if(scope.isOpen){
					scope.$apply(function(){
						collapse();
						scope.isOpen = false;
					});
				}
			});
			function collapse(){
				if(childrenLength <6){
					elementLastChildren.css({overflow : 'hidden'});
				}
				element.removeClass('active');
				elementLastChildren.addClass('animating slide down out');
				$animateCss(elementLastChildren, {
					easing : 'ease',
					from : {height : elementLastChildren[0].offsetHeight + 'px'},
					to: {height:  '0px'},
					duration : .4
				}).start()['finally'](collapseDone);
			};
			function collapseDone(){
				element.removeClass('visible');
				elementLastChildren.removeClass('visible animating slide down out').addClass('hidden');
				elementLastChildren.css({height : 'auto', display : ''});

			};
			function expand(slideHeight){
				if(childrenLength <6){
					elementLastChildren.css({overflow : 'hidden'});
				}
            				elementLastChildren.css({display : 'block'});
            				element.addClass('active');
            				elementLastChildren.removeClass('hidden').addClass('animating slide down in');
				$animateCss(elementLastChildren, {
					easing : 'ease',
					from : { height : '0px'},
					to: { height: slideHeight + 'px' },
					duration : .25
				}).start()['finally'](expandDone);
			};
			function expandDone(){
				element.addClass('visible');
				elementLastChildren.removeClass('animating slide down in').addClass('visible');
			};
			function getHeight(elem){
				var targetHeight = 0;
				var originStyle = elem[0].style.display;
				elem.css({display : 'block', visibility : 'hidden' });
				targetHeight = elem[0].offsetHeight;
				elem[0].style.display = originStyle;
				elem.css({display : originStyle, visibility : ''});
				return targetHeight;
			};
	
		}
	};
}])

.directive('uiDropdown', function(){
	return {
		restrict : 'E',
		replace : true,
		transclude : true,
		template : '<div class="item" ng-transclude></div>',
		link : function(scope, element, attrs){
			
		}
	};
});