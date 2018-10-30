(function(angular) {
    youtubeApp.controller('trendingPageController', ['$rootScope', '$scope', '$state', 'searchService', '$stateParams',
        function($rootScope, $scope, $state, searchService, $stateParams) {
            $scope.init = function() {
                var categoryId;
                switch ($stateParams.category) {
                    case 'music':
						document.title = 'VideosYT - Vídeos musicais de tendências';
                        $scope.title = 'Vídeos musicais de tendências';
                        categoryId = 10;
                        break;
                    case 'sports':
						document.title = 'VideosYT - Vídeos esportivos de tendências';
                        $scope.title = 'Vídeos esportivos de tendências';
                        categoryId = 17;
                        break;
                    case 'technology':
						document.title = 'VideosYT - Vídeos de tecnologia de tendências';
                        $scope.title = 'Vídeos de tecnologia de tendências';
                        categoryId = 28;
                        break;
                    case 'movies':
						document.title = 'VideosYT - Trending Movies Videos';
                        $scope.title = 'Trending Movies Videos';
                        categoryId = 1;
                        break;
                    case 'comedy':
						document.title = 'VideosYT - Trending Comedy Videos';
                        $scope.title = 'Trending Comedy Video';
                        categoryId = 23;
                        break;
                    case 'People & Blogs':
						document.title = 'VideosYT - Vídeos populares de pessoas e blogs';
                        $scope.title = 'Vídeos populares de pessoas e blogs';
                        categoryId = 15;
                        break;
                    default:
						document.title = 'VideosYT - Vídeos em destaque';
                        $scope.title = 'Vídeos em destaque';
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
