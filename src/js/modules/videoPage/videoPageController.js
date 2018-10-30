(function(angular) {
    youtubeApp.controller('videoPageController', ['$document', '$sce', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'searchService', '$interval',
        function($document, $sce, $rootScope, $scope, $state, $stateParams, $timeout, searchService, $interval) {
            $scope.formatVideoDetails = function() {
                if (moment().format("M D YY") == moment($scope.video.snippet.publishedAt).format("M D YY")) {
                    $scope.uploadedTime = moment($scope.video.snippet.publishedAt)
                        .fromNow();
                } else {
                    $scope.uploadedTime = moment($scope.video.snippet.publishedAt)
                        .format("Do MMMM YYYY");
                }

                $scope.likeCount = isNaN(parseInt($scope.video.statistics.likeCount)) ? 0 : parseInt($scope.video.statistics.likeCount);
                $scope.dislikeCount = isNaN(parseInt($scope.video.statistics.dislikeCount)) ? 0 : parseInt($scope.video.statistics.dislikeCount);
                $scope.dislikeWidth = {
                    'width': (($scope.dislikeCount / ($scope.likeCount + $scope.dislikeCount)) * 100) + '%'
                };

                if ($scope.video.snippet.description.length > 300) {
                    $scope.isExpandable = true;
                    $scope.expandDescriptionBar = "Expand Description";
                    $scope.expandDescription = function() {
                        if ($scope.description == "expanded-description") {
                            $scope.description = "";
                            $scope.expandDescriptionBar = "Expand Description";
                            angular.element($document).scrollToElementAnimated(videoInfo);
                        } else {
                            $scope.description = "expanded-description";
                            $scope.expandDescriptionBar = "Collapse Description";
                        }
                    }
                } else {
                    $scope.isExpandable = false;
                }
            }

            $scope.loadMoreComments = function(pageToken) {
                var parameters = {
                    'videoId': $scope.videoId,
                    'pageToken': pageToken,
                    'order': $scope.order
                }

                $scope.commentsLoader = true;
                searchService.getCommentThreads(parameters).then(function(moreComments) {
                    $scope.comments.items = $scope.comments.items.concat(moreComments.items);
                    $scope.comments.nextPageToken = moreComments.nextPageToken;
                    $scope.commentsLoader = false;
                });
            }

            $scope.sortComments = function(order) {
                if (!$scope.videoId)
                    return;

                if (order) {
                    $scope.order = order;
                }
                var parameters = {
                    'videoId': $scope.videoId,
                    'order': ($scope.order) ? $scope.order : 'relevance'
                }
                $scope.commentsLoader = true;
                $scope.comments = null;
                searchService.getCommentThreads(parameters).then(function(comments) {
                    $scope.comments = comments;
                    $scope.commentsLoader = false;
                }, function(reason) {
                    if (reason.error.errors[0].reason = "commentsDisabled") {
                        $scope.commentsEnabled = false;
                    }
                });
            }

            $scope.loadMoreVideos = function() {
                var parameters = {
                    'relatedToVideoId': $scope.videoId,
                    'maxResults': 8,
                    'pageToken': $scope.nextPageToken
                }
                $scope.loaderVideos = true;
                $scope.nextPageToken = false;
                searchService.searchVideos(parameters)
                    .then(function(videos) {
                        $scope.relatedVideos = $scope.relatedVideos.concat(videos.items);
                        $scope.nextPageToken = videos.nextPageToken;
                        $scope.loaderVideos = false;
                        var parameters = {
                            'videos': $scope.relatedVideos,
                            'part': 'statistics,contentDetails'
                        }
                        searchService.getVideoDetails(parameters)
                            .then(function(videoDetails) {
                                $scope.videoDetails = $scope.videoDetails.concat(videoDetails);
                            });
                    });
            }

            $scope.loadRelatedVideos = function() {
                $scope.loaderVideos = true;
                $scope.nextPageToken = false;
                var parameters = {
                    'relatedToVideoId': $scope.videoId,
                    'maxResults': 20
                }
                searchService.searchVideos(parameters)
                    .then(function(videos) {
                        $scope.relatedVideos = videos.items;
                        $scope.nextPageToken = videos.nextPageToken;
                        $scope.loaderVideos = false;
                        var parameters = {
                            'videos': $scope.relatedVideos,
                            'part': 'statistics,contentDetails'
                        }
                        searchService.getVideoDetails(parameters)
                            .then(function(videoDetails) {
                                $scope.videoDetails = videoDetails;
                            });
                    });
            }

            $rootScope.$on('$stateChangeStart',
                function(event, viewConfig) {
                    if (viewConfig.name == "home.videoPage") {
                        $scope.barModeAfterSlide = false;
                        $timeout(function() { $scope.barMode = false; }, 0);
                        angular.element($document).scrollTo(0, 0, 0);

                    } else {
                        NProgress.start();
                        $timeout(function() { $scope.barModeAfterSlide = true; }, 400);
                        $timeout(function() { $scope.barMode = true; }, 0);
                    }
                });

            $rootScope.$on('$stateChangeSuccess',
                function(event, viewConfig, params) {
                    if (viewConfig.name == "home.videoPage") {
                        if (params.id != $stateParams.id) {
                            $scope.changeVideo(params.id);
                            NProgress.inc();
                            $timeout(NProgress.inc, 300);
                            $timeout(NProgress.done, 600);
                        } else {
                            NProgress.done();
                        }
                    } else {
                        NProgress.inc();
                        $timeout(NProgress.inc, 300);
                        $timeout(NProgress.done, 600);
                    }
                });

            if($state.params.id && $state.current.name == "home.videoPage"){
                $scope.barMode = false;
                $scope.barModeAfterSlide = false;
            } else {
                $scope.barMode = true;
                $scope.barModeAfterSlide = true;
            }
            
            $scope.init = function() {
                angular.element($document).scrollTo(0, 0, 700);
                $scope.videoId = $state.params.id;
                $scope.commentsEnabled = true;
                $scope.commentsLoader = true;

                if (!$scope.videoId || $state.current.name != "home.videoPage")
                    return;

                var parameters = {
                    'videoId': $scope.videoId,
                    'part': 'snippet,statistics,contentDetails',
                    'fields': 'items(contentDetails(duration),snippet(publishedAt,channelId,description,title,thumbnails(medium/url,standard/url)),statistics(commentCount,dislikeCount,likeCount,viewCount))'
                }
                searchService.getVideos(parameters)
                    .then(function(video) {
                        $scope.video = video.items[0];
                        updateTimerCallback(true);
                        document.title = 'Yoobuv - ' + $scope.video.snippet.title;
                        $scope.video.snippet.descriptionHTML = $sce.trustAsHtml(autolinker.link($scope.video.snippet.description));
                        $scope.formatVideoDetails();
                        var parameters = {
                            'part': 'snippet',
                            'channelId': $scope.video.snippet.channelId,
                            'fields': 'items(id,snippet(thumbnails/default,title))'
                        }
                        searchService.getChannel(parameters)
                            .then(function(channel) {
                                $scope.channel = channel;
                                NProgress.done();
                            });
                    });
            }

            $scope.changeVideo = function(videoId) {
                NProgress.start();
                $scope.videoId = videoId;
                $state.go('home.videoPage', { id: videoId }, { notify: false });
                $stateParams.id = videoId;
                $scope.init();
                $scope.loadRelatedVideos();
                $scope.sortComments();
                $scope.commentsEnabled = true;
                if ($scope.expandDescriptionBar == "Collapse Description")
                    $scope.expandDescription();

            }

            $scope.playPauseVideo = function() {
                if ($scope.isPlaying) {
                    $scope.player.pauseVideo();
                } else {
                    $scope.player.playVideo();
                }
                $scope.isPlaying = !$scope.isPlaying;
            }

            $scope.onPlayerStateChange = function(event) {
                var playerState = event.data;
                if (playerState == YT.PlayerState.PLAYING) {
                    $scope.isPlaying = true;
                    $scope.isBuffering = false;
                    $scope.cleanupPromise = $interval(updateTimerCallback, 1000);
                } else {
                    $interval.cancel($scope.cleanupPromise);
                    if (playerState == YT.PlayerState.BUFFERING)
                        $scope.isBuffering = true;
                    else
                        $scope.isBuffering = false;

                    $scope.isPlaying = false;
                }

                $scope.$apply();
            }

            function updateTimerCallback(firstTime) {
                if(firstTime==true){
                    $scope.progressBarWidth = {
                        'width': '0%'
                    }
                    $scope.bufferBarWidth = {
                        'width': '0%'
                    }
                    $scope.video.currentTime = '0:00';
                    return;
                }
                try {
                    var progressBarWidth = ($scope.player.getCurrentTime() / $scope.player.getDuration()) * 100;
                    $scope.progressBarWidth = {
                        'width': isNaN(progressBarWidth) ? 0 : progressBarWidth + '%'
                    }

                    var bufferBarWidth = $scope.player.getVideoLoadedFraction() * 100;
                    $scope.bufferBarWidth = {
                        'width': bufferBarWidth + '%'
                    }

                    $scope.video.currentTime = moment.duration({ 'seconds': $scope.player.getCurrentTime() }).format('hh:mm:ss');
                    if ($scope.video.currentTime.indexOf(':') == -1)
                        $scope.video.currentTime = '0:' + $scope.video.currentTime;

                } catch (e) {}

            }
        }
    ]);
})(window.angular);
