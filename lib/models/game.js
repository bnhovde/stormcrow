'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Game Schema
 */
var GameSchema = new Schema({

  name: String,
  gm: Number,
  lookingForPlayers: Number,
  characters: [{
        _userid: Number,
        characterName: String,
        avatar: String,
        attributeOne: Number,
        attributeOneMax: Number,
        attributeTwo: Number,
        attributeTwoMax: Number,
        attributeThree: Number
      }]
});


mongoose.model('Game', GameSchema);