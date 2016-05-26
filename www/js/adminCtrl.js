/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('AdminCtrl', function ($scope, aJaxService, $ionicPopup, $state) {

    $scope.user = {};

    var requestUrl = "?cmd=customDetail&token=" + aJaxService.getToken();

    aJaxService.httpGetData(requestUrl)
      .success(function (data) {
        $scope.user = data.data;
      })
      .error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: '获取信息失败',
          template: '获取用户信息失败！请重新获取！'
        });
      });

    $scope.logout = function () {
      $ionicPopup.confirm({
        title: '取消登录',
        template: '确认登出吗?'
      }).then(function (res) {
        if (res) {
          aJaxService.logout()
            .success(function (data) {
              $state.go("login");
            })
            .error(function (data) {
              $ionicPopup.alert({
                title: '取消登录失败',
                template: '取消登录失败'
              });
            });
        }
      });
    };


  });
