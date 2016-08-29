/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('AdminCtrl', function ($scope, aJaxService, utilService, $state, $ionicLoading, T) {

    $scope.user = {};

    // Setup the loader
    $ionicLoading.show({
      content: T.T('加载中')
    });

    var requestUrl = "?cmd=customDetail&token=" + aJaxService.getToken();
    aJaxService.httpGetData(requestUrl)
      .success(function (data) {
        $scope.user = data.data;
        $ionicLoading.hide();
      })
      .error(function (data) {
        $ionicLoading.hide();
        utilService.showAlert(T.T('获取信息失败'), T.T('获取用户信息失败！请重新获取！'));
        $state.go("main");
      });

    $scope.logout = function () {

      utilService.showConfirm(T.T('取消登录'), T.T('确认登出吗?'), T.T('确定'), T.T('取消'), function () {
        aJaxService.logout()
          .success(function (data) {
            $state.go("login");
          });
      });

    };

    $scope.toMainPage = function () {
      $state.go("main");
    };

    $scope.goManage = function () {
      $state.go("manage");
    };

    $scope.goClientList = function () {
      $state.go("clientList");
    };

  });
