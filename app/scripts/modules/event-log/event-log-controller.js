'use strict';

angular.module('stormCrowApp')
  .controller('EventLogCtrl', function($rootScope, $scope) {

    /**
     * Event log text field state change function
     * @No parameters
     */

    $scope.macroChecker = function() {
      // code for anything that happens on change in text box
    };


    /**
     * Event Logger "Send As" function
     * @Parameters type and text
     */

    $rootScope.eventLoggerSendAs = function() {

      // if the user isn't the GM they can send as player or character
      if (!$scope.userIsGM) {

        $scope.sendAsOptions = [{
          type: 'character',
          name: $rootScope.userCharacter.characterName,
        }, {
          type: 'player',
          name: $rootScope.userCharacter.playerName,
        }];
      } // GM can send as GM or any character
      else {
        // adds GM option
        $scope.sendAsOptions = [{
          type: 'character',
          name: 'GM'
        }];
        // loops through characters and adds names to GM send as options
        for (var i = 0; i < $rootScope.allCharacters.length; i++) {

          var character = {
            type: 'playercharacter',
            name: $rootScope.allCharacters[i].characterName
          };
          $scope.sendAsOptions.push(character);
        }
        // end of for loop
      }
      // end of if else
      $scope.sendMessageAs = $scope.sendAsOptions[0];
    };
    // end of eventLoggerSendAs


    /**
     * Send message function
     * @No parameters
     */

    // blanks out message text
    $scope.messageText = '';

    $scope.sendMessage = function() {

      // main variable declarations
      var whisper = false;
      var text = $scope.messageText;
      var character = $scope.sendMessageAs.name;
      var user = $rootScope.userCharacter.playerName;
      var message = '';
      var sentAs = $scope.sendMessageAs.type;

      // roll initiative with /i
      if ($scope.messageText.substring(0, 2) === '/i') {

        // if you write /i followed by a number it will grab the number e.g /i 3
        var mod = $scope.messageText.split(' ')[1];

        if (mod) {
          // converts mod to a number
          mod = parseInt(mod);
        }
        else {
          mod = 0;
        }

        // makes initiative roll
        var roll = Math.floor(Math.random() * 20 + 1) + mod;

      // sets up model for character
        var characterToAdd = {
          id: $rootScope.userCharacter.id,
          characterName: $rootScope.userCharacter.characterName,
          avatarSmall: $rootScope.userCharacter.avatar,
          initiativeRoll: roll
        };

        // adds character to order list
        $rootScope.addToOrder(characterToAdd);

        // sets up model for message in event box
        message = {
          type: 'action',
          user: character,
          text: 'rolls for initiative',
          dx: 20,
          mod: mod,
          roll: roll,
          amountOfDice: 1,
          time: new Date(),
        };

        // adds message to event feed and blanks out text
        $rootScope.addToEventFeed(message);
        $scope.messageText = '';
        return;

      } // whisper with /w
      else if ($scope.messageText.substring(0, 1) == '@') {

        // get character whispered tofirst name
        whisper = $scope.messageText.split(' ')[0].substr(1);

        // converts both entered name and current user character name to lower case to allow case insensitive matching.  grabs first name only
        var lcString = whisper.toLowerCase();
        var lcString1 = $rootScope.userCharacter.characterName.split(' ')[0].toLowerCase();

        // if you are trying to whisper to your own character name - alert message
        if (lcString == lcString1) {
          $rootScope.addAlertMessage('error', 'Duh, why you talking to yourself?!.');
          return;
        }

        // loop through all characters
        for (var i = 0; i < $rootScope.allCharacters.length; i++) {

          // sets character name to lower case for case insensitive matching - grabs first name only
          var lcString2 = $rootScope.allCharacters[i].characterName.split(' ')[0].toLowerCase();

          // if first name matches the whisperee then send the message
          if (lcString == lcString2) {

            character = character + ' whispers to ' + $rootScope.allCharacters[i].characterName.split(' ')[0];
            text = $scope.messageText.split(' ').slice(1).join(' ');

            // sets up message to be sent
            message = {
              type: 'message',
              user: user,
              text: text,
              time: new Date(),
              whisper: whisper,
              sentAs: sentAs,
              character: character
            };

            // sends message and blanks out box
            $rootScope.addToEventFeed(message);
            $scope.messageText = '';
            return;
          }
          // end of if/else

        }
        // end of for loop for all characters
        $rootScope.addAlertMessage('error', 'No character called ' + whisper + '. Try again!');
        return;
      }
      // end of whisper else if

      // sets up message to be sent
      message = {
        type: 'message',
        user: user,
        text: text,
        time: new Date(),
        whisper: whisper,
        sentAs: sentAs,
        character: character
      };

      // sends message and blanks out box
      $rootScope.addToEventFeed(message);
      $scope.messageText = '';
    };
    // end of send message function

  });