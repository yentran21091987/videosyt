(function(angular) {
    youtubeApp.controller('youtubeController', ['$rootScope','$scope', '$state', 'searchService', '$stateParams',
        function($rootScope, $scope, $state, searchService, $stateParams) {
            $scope.submit = function() {
                $scope.preloader = true;
                $scope.videos = false;
                $scope.nextPageToken = false;
                $scope.prevPageToken = false;
				document.title = 'Youtube - ' + $stateParams.query;
                var parameters = {
                    'pageToken': $stateParams.pageToken,
                    'query': $stateParams.query,
                    'maxResults' : 16
                }
                searchService.searchVideos(parameters)
                    .then(function(videos) {
                        $scope.videos = videos.items;
                        $scope.nextPageToken = videos.nextPageToken;
                        $scope.prevPageToken = videos.prevPageToken;
                        $scope.preloader = false;

                        var parameters = {
                            'videos': $scope.videos,
                            'part': 'statistics,contentDetails'
                        }
                        searchService.getVideoDetails(parameters)
                            .then(function(videoDetails) {
                                $scope.videoDetails = videoDetails;
                            });

                    });
            }

            $scope.nextOrPrev = function(pageToken) {
                $state.go('home.searchVideos', { query: $stateParams.query, pageToken: pageToken });
            }

            $scope.init = function(){
                $scope.submit();
                $scope.$on('$destroy', function () {
                    $rootScope.$$childHead.query = "";
                })
            }
            
        }
    ]);
})(window.angular);
