/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.filters', [])

  .filter("formatdate", function () {
    return function (input) {
      return input.substring(0, input.lastIndexOf(":"));
    }
  })

  .filter("setLength", function () {
    return function (input, length) {
      if (input.length > 3) {
        return input.substring(0, length) + "..";
      } else {
        return input;
      }
    }
  });
