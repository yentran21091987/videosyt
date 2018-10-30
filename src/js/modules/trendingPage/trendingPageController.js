(function(angular) {
    youtubeApp.controller('trendingPageController', ['$rootScope', '$scope', '$state', 'searchService', '$stateParams',
        function($rootScope, $scope, $state, searchService, $stateParams) {
            $scope.init = function() {
                var categoryId;
                switch ($stateParams.category) {
                    case 'music':
						document.title = 'Tootub - Trending Music Videos';
                        $scope.title = 'Trending Music Videos';
                        categoryId = 10;
                        break;
                    case 'sports':
						document.title = 'Tootub - Trending Sports Videos';
                        $scope.title = 'Trending in Sports';
                        categoryId = 17;
                        break;
                    case 'technology':
						document.title = 'Tootub - Trending Technology Videos';
                        $scope.title = 'Trending Technology Videos';
                        categoryId = 28;
                        break;
                    case 'movies':
						document.title = 'Tootub - Trending Movies Videos';
                        $scope.title = 'Trending Movies Videos';
                        categoryId = 1;
                        break;
                    case 'comedy':
						document.title = 'Tootub - Trending Comedy Videos';
                        $scope.title = 'Trending Comedy Video';
                        categoryId = 23;
                        break;
                    case 'People & Blogs':
						document.title = 'Tootub - Trending People & Blogs Videos';
                        $scope.title = 'Trending People & Blogs Videos';
                        categoryId = 15;
                        break;
                    default:
						document.title = 'Tootub - Trending Videos';
                        $scope.title = 'Trending Videos';
                        categoryId = null;
                }

                $scope.loader = true;
                parameters = {
                    'videoCategoryId': categoryId,
                    'part': 'snippet,statistics,contentDetails',
                    'maxResults': 12,
                    'chart': 'mostPopular',
                    'pageToken' : $stateParams.pageToken
                }
                searchService.getVideos(parameters).then(function(data) {
                    for (var i = 0; i < data.items.length; i++) {
                        var id = data.items[i].id;
                        data.items[i].id = {};
                        data.items[i].id.videoId = id;
                    }
                    $scope.nextPageToken = data.nextPageToken;
                    $scope.prevPageToken = data.prevPageToken;
                    $scope.videos = data.items;
                    $scope.loader = false;
                })
            }

            $scope.nextOrPrev = function(pageToken) {
                $state.go('home.trending', { category: $stateParams.category, pageToken: pageToken });
            }
        }
    ]);
})(window.angular);
