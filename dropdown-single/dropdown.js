angular.module('angularify.semantic.dropdown', [])

  .filter('allowHtml', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}])

.controller('DropDownController', ['$scope','$compile', '$rootScope', function($scope,$compile,$rootScope){
	$scope.options = [];
	this.addOption = function(text, value){
		$scope.options.push({'text': text, 'value': value});
		if (value == $scope.model){
			this.updateTitle(value)
		};
	};
	this.updateModel = function(value){
		if ($scope.model != value)
			$scope.model = value;
	};
	this.updateTitle = function(value){
		var changed = false;
		for (var index in $scope.options){
			if ($scope.options[index].value == value){
				$scope.placeholder = $scope.options[index].text;
				changed = true;
			}
		}
		if(changed){
			$scope.default = false;
		}else{
			$scope.default = true;
		}
	};

}])

.directive('uiDropdownSingle', ['$animateCss','$document','$timeout', function($animateCss, $document, $timeout){
	return {
		restrict : 'E',
		replace : true,
		transclude : true,
		controller : 'DropDownController',
		scope: {
			model : '=ngModel',
			placeholder : '@exPlaceholder',
			editable : '@exEditable'
		},
		template: '<div class="ui dropdown"  tabindex="-1">' +
			'<input type="text" class="search" ng-model="searchValue"></input>' +
			'<div class="text" ng-class="{default: default, filtered : filtered}" ng-bind-html="placeholder | allowHtml"></div>' +
			'<i class="dropdown icon"></i>' +
			'<div class="menu transition hidden" ng-transclude>' +
			'</div>' +
			'</div>',
		link: function(scope, element, attrs, DropDownController){
			scope.default = false;
			scope.isOpen = false;
			scope.filtered = false;	

			scope.$watch('model', function(value){
				DropDownController.updateTitle(value);
		
			});

			var searchElement = element.children().eq(0);
			var elementLastChildren = element.children().eq(-1);
			var childrenLength = elementLastChildren.children().length;

			if(scope.editable){
				element.addClass('search selection');
				searchElement[0].type = '';
				$timeout(function () {	

					var childrenLength = elementLastChildren.children().length;

					scope.$watch('searchValue', function(value){

						if(searchElement[0].value == ""){
							value = '';	
						};

						if(value){
							scope.filtered = true;
							for(var i =0; i < childrenLength; i++){
								var itemValue = elementLastChildren.children().eq(i)[0].getAttribute('value');
								if( itemValue.indexOf(value) ){
									elementLastChildren.children().eq(i).addClass('filtered');
								}else{
									elementLastChildren.children().eq(i).removeClass('filtered');
								}

							}
						}else{
							scope.filtered = false;
							for(var i =0; i < childrenLength; i++){
								elementLastChildren.children().eq(i).removeClass('filtered');
							}
						}
					});
						
				}, 0);

			}else{
				searchElement[0].type = 'hidden'
			}

			element.bind('click', function(event){
				event.stopPropagation();

				scope.filtered = false;						//editable = true
				element[0].getElementsByClassName('search')[0].value = "";	//editable = true

				if(scope.isOpen){
					scope.$apply(function(){
						collapse();
					});       
				}else{
					element.children().eq(0)[0].focus();			//editable = true
					scope.$apply(function(){
						var slideHeight = getHeight(elementLastChildren);
						expand(slideHeight);
					});         
				}
				scope.isOpen = !scope.isOpen;
			});

			element.bind('blur', function(){
				scope.filtered = false;						//editable = true
				element[0].getElementsByClassName('search')[0].value = "";	//editable = true
				
				if(scope.isOpen){
					scope.$apply(function(){
						collapse();
						scope.isOpen = false;
					});
				}
			});

			$document.on('click', function(){					//editable = true
				scope.filtered = false;					
				element[0].getElementsByClassName('search')[0].value = "";	

				if(scope.isOpen){
					scope.$apply(function(){
						collapse();
						scope.isOpen = !scope.isOpen;
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
					duration : .25
				}).start()['finally'](collapseDone);
			};
			function collapseDone(){
				element.removeClass('visible');
				elementLastChildren.removeClass('visible animating slide down out').addClass('hidden');
				elementLastChildren.css({height : 'auto', display : ''});

				for(var i =0; i < elementLastChildren.children().length; i++){		//editable = true
					elementLastChildren.children().eq(i).removeClass('filtered');
				}
				scope.$$watchers[0].last = '';						//editable = true
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
					duration : .3
				}).start()['finally'](expandDone);
			};
			function expandDone(){
				element.addClass('visible');
				elementLastChildren.removeClass('animating slide down in').addClass('visible');
				elementLastChildren.css({height : 'auto'});
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

.directive('uiDropdown', ['$compile', '$timeout', function($compile, $timeout){
	return {
		restrict : 'E',
		replace : true,
		transclude : true,
		require : '^uiDropdownSingle',
		scope: {
			active : '=exActive',
			keyword : '=exKeyword'
		},
		template : '<div class="item" ng-model="abcd" ng-transclude></div>',
		link : function(scope, element, attrs, DropDownController){
			
			$timeout(function () {	
				scope.itemText = element[0].innerHTML;
				scope.itemValue = element[0].innerText;
				scope.value = scope.keyword || element[0].innerText;
				element[0].setAttribute('value', scope.value);
				DropDownController.addOption(scope.itemText, scope.itemValue);	
			}, 0);

			if(scope.active){
				element.addClass('active selected');
			}
			element.bind('click', function(){
				DropDownController.updateModel(scope.itemValue);
				scope.$apply(function(){
					element.parent().children().removeClass('active selected');
					element.addClass('active selected');
				});
			});

		}  
		
	};
}]);