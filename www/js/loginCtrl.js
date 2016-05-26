/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers', ['ionic'])

  .controller('LoginCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state, $interval) {
    $scope.data = {
      countdown: 60,
      showMessage: false,
      showCountNumber: false,
      vaildButton: false
    };

    var countdownInit = function () {
      $scope.data.countdown = 60;
      $scope.data.showCountNumber = false;
    };

    countdownInit();

    $scope.loginSendSMSCode = function () {



      if (!utilService.checkMobile($scope.data.mobile)) {

        $ionicPopup.alert({
          title: '提示',
          template: '不是完整的11位手机号或者正确的手机号前七位！'
        });

        return;
      }
      var requestUrl = "?cmd=loginOrRegSendSMSCode&mobile=" + $scope.data.mobile;

      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          myTime();
          $scope.data.showMessage = true;
          $scope.data.vaildButton = true;
          $scope.data.showCountNumber = true;
          if (data.result === 0) {
            $scope.data.message = "验证码已发送";
          } else {
            $scope.data.message = data.msgc;
          }
        })
        .error(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '获取失败',
            template: '获取验证码失败！请重新获取！'
          });
        });


    };

    $scope.loginWithSMSCode = function () {

      if (!$scope.data.vaildButton)
        return;

      if (!utilService.checkMobile($scope.data.mobile)) {
        $ionicPopup.alert({
          title: '提示',
          template: '不是完整的11位手机号或者正确的手机号前七位！'
        });
        return;
      }

      var requestUrl = "?cmd=loginOrRegWithSMSCode&mobile=" + $scope.data.mobile + "&code=" + $scope.data.code;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          console.log("login Data = " + JSON.stringify(data));
          if (data.result === 0) {
            aJaxService.setToken(data.data.token);
            $state.go('main');
          } else {
            aJaxService.setToken(undefined);
            $scope.data.showMessage = true;
            $scope.data.message = data.msgc;
          }
        })
        .error(function (data) {

          aJaxService.setToken(undefined);

          var alertPopup = $ionicPopup.alert({
            title: '登录',
            template: '登录失败!'
          });
        });
    };

    $scope.logon = function () {
      $state.go('logon');
    };

    var timePromise;
    var myTime = function () {
      timePromise = $interval(function () {
        $scope.data.countdown--;
        if ($scope.data.countdown === 0) {
          countdownInit();
          $interval.cancel(timePromise);
//          $scope.data.showMessage = false;
        }
//      $scope.$digest(); // 通知视图模型的变化
      }, 1000);
    };


  });
