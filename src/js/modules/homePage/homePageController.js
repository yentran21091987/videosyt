(function(angular) {
    youtubeApp.controller('homePageController', ['$scope', '$state', 'searchService', '$stateParams',
        function($scope, $state, searchService, $stateParams) {
			//document.title = 'Youtube in BR';
            $scope.videoCategories = [{
                'snippet': {
                    'title': 'Popular Agora'
                }
			}, {
                'id': 1,
                'snippet': {
                    'title': 'Filme e Entretenimento'
                }
	        }, {
                'id': 15,
                'snippet': {
                    'title': 'Pessoas e Blogs'
                }
			}, {
                'id': 2,
                'snippet': {
                    'title': 'Vlogs'
                }		
            }, {
                'id': 10,
                'snippet': {
                    'title': 'Música'
                }
            }, {
                'id': 23,
                'snippet': {
                    'title': 'Comédia'
                }
            }, {
                'id': 17,
                'snippet': {
                    'title': 'Esportes'
                }
            }, {
                'id': 28,
                'snippet': {
                    'title': 'Tecnologia'
                }
            }, {
                'id': 20,
                'snippet': {
                    'title': 'Video Games'
                }
            }]
        }
    ]);
})(window.angular);
