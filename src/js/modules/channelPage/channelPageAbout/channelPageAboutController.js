(function(angular) {
    youtubeApp.controller('channelPageAboutController', ['$document','$scope', '$state', '$stateParams', 'searchService',
        function($document, $scope, $state, $stateParams, searchService) {
			document.title = 'Youtube - ' + $scope.channel.snippet.title + ' - About';
            $scope.init = function() {
                angular.element($document).scrollTo(0, 0, 700);
                
                var parameters = {
                    'part': 'statistics',
                    'channelId': $stateParams.id
                }

                searchService.getChannel(parameters).then(function(channel) {
                    channel.statistics.viewCount = parseInt(channel.statistics.viewCount).toLocaleString();
                    channel.statistics.subscriberCount = parseInt(channel.statistics.subscriberCount).toLocaleString();
                    channel.statistics.videoCount = parseInt(channel.statistics.videoCount).toLocaleString();
                    $scope.$parent.channel.statistics = channel.statistics;
                })
            }
        }
    ]);
})(window.angular);
