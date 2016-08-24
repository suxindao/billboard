/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.filters')

  .filter("formatdate", function () {
    return function (input) {
      return input.substring(0, input.lastIndexOf(":"));
    }
  })

  .filter("setLength", function () {
    return function (input, length) {
      if (input.length > length) {
        return input.substring(0, length) + "..";
      } else {
        return input;
      }
    }
  })

  .filter("T", ['$translate', function ($translate) {
    return function (key) {
      console.log($translate.instant(key));
      // if (key) {
      //   if ($translate.proposedLanguage() == "zh")
      //     return key;
      //   return $translate.instant(key);
      // }
      return $translate.instant(key);
    };
  }]);
