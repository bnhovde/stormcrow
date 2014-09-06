'use strict';

angular.module('stormcrowApp')
    .controller('DashboardCtrl', function($rootScope, $scope, Auth, $location, $q, Games, $http, State) {

        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.currentUser = Auth.getCurrentUser();

        $scope.getUserGames = function() {

            var userid = ({
                uid: $scope.currentUser._id
            });

            // Fetch open games from the Game API
            var getAllUserGames = Games.getUserGames(userid);
            var getAllOpenGames = Games.getOpenGames(userid);

            $q.all([
                getAllOpenGames.$promise,
                getAllUserGames.$promise
            ]).then(function() {
                    // on success
                    $scope.userGames = getAllUserGames.data;
                    $scope.openGames = getAllOpenGames.data;
                },
                // on error
                function(error) {
                // $rootScope.addAlertMessage('error', 'There was a problem loading games - try refreshing the page');
                }
            );
        };

        $scope.getUserGames();


        /**
         * Save current game to user model
         * @Parameters game
         */
         
        $scope.setActiveGame = function(game) {

            // Set active game to state
            State.setActiveGame(game._id);
            console.log('setting game to ' + game._id);

            // Save game settings to the user model
            $http.put('/api/users', { 
                id: $scope.currentUser._id,
                activeGame: game._id
            });

        };

    });