/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('MainCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state, $ionicLoading, T) {

    $scope.clickPost = function () {

//                var resutls=[{"filePath":"img/jmmg.png","md5":"875EFC59FBDF6B27477DD222CAA46D89"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"}];
//
//               $state.go("makeVideo",{"data":resutls});
//


      $state.go("makeVideo");
    };

    $scope.goManage = function () {
      $state.go("manage");
    };

    $scope.goDevice = function () {
      $state.go("clientList");
    };

    $scope.goAdmin = function () {
      $state.go("admin");
    };

    $scope.goTest = function () {
      $ionicLoading.show({
        template: T.T('内容加载中'),
        // animation: 'fade-in',
        // showBackdrop: true,
        // maxWidth: 200,
        // showDelay: 0
      });
    };


  });
