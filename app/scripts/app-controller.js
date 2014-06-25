'use strict';

angular.module('stormCrowApp')
   .controller('AppCtrl', function($rootScope, $scope, $timeout) {

      // Show hide dice roller
      $scope.diceRollShow = false;

      $scope.toggleDiceRoller = function() {
         $scope.diceRollShow = $scope.diceRollShow === false ? true : false;
      };



      // Alert Messages

      $rootScope.alertMessages = [];

      // function to add a new alert message
      $rootScope.addAlertMessage = function(type, text) {
         // if alert text is not defined
         if (typeof(text) == "undefined") {
            if (typeof(text) != "undefined") text = type;
            else text = "No alert message specified.";
            type = "alert";
         }
         $rootScope.alertMessages.push({
            type: type,
            text: text
         });
         $timeout(function() {
            $rootScope.removeAlertMessage(-1);
         }, 5000);
      };
      // function remove an exisiting alert message
      $rootScope.removeAlertMessage = function(index) {
         if (index < 0 || index >= $rootScope.alertMessages.length) {
            index = 0;
         }
         $rootScope.alertMessages.splice(index, 1);
      };

      // Loading Widgets

      $rootScope.widgetLoading = {};
      // function to show and hide widget loaders
      $rootScope.showLoading = function(elementId) {
          $rootScope.widgetLoading[elementId] = true;
      };
      $rootScope.hideLoading = function(elementId) {
          if (elementId == "" || typeof elementId == "undefined") {
              $rootScope.widgetLoading = {};
          } else {
              delete($rootScope.widgetLoading[elementId]);
          }
      };


   });