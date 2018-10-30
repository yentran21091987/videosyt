(function(angular) {
    youtubeApp.controller('channelPageHomeController', ['$document','$scope', '$state', '$stateParams', 'searchService',
        function($document, $scope, $state, $stateParams, searchService) {       
            $scope.init = function(){
            	angular.element(document).scrollTo(0, 0, 700);
                //document.title = 'Youtube - ' + $scope.channel.snippet.title ;
            	$scope.channelId = $stateParams.id;
            	$scope.mostPopular = {
            		'title' : 'Most Popular',
            		'value' : 'viewCount'
            	}

            	$scope.recent = {
            		'title' : 'Recently Uploaded',
            		'value' : 'date'
            	}

            }
        }
    ]);
})(window.angular);