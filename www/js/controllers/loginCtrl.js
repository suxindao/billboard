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
        utilService.showAlert('提示', '不是完整的11位手机号或者正确的手机号前七位！');
        return;
      }

      var requestUrl = "?cmd=loginOrRegSendSMSCode&mobile=" + $scope.data.mobile;
      myTime();
      $scope.data.showMessage = true;
      $scope.data.showCountNumber = true;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          $scope.data.vaildButton = true;
          $scope.data.message = "验证码已发送";
        })
        .error(function (data) {
          utilService.showAlert('获取失败', '获取验证码失败！请重新获取！');
          $scope.data.message = data.msgc;
        });


    };

    $scope.loginWithSMSCode = function () {

//      if (!$scope.data.vaildButton)
//        return;

      if (!utilService.checkMobile($scope.data.mobile)) {
        utilService.showAlert('提示', '请输入正确的手机号码！');
        return;
      }

      if (!utilService.checkSMSCode($scope.data.code)) {
        utilService.showAlert('提示', '短信验证码格式不正确!');
        return;
      }

      var requestUrl = "?cmd=loginOrRegWithSMSCode&mobile=" + $scope.data.mobile + "&code=" + $scope.data.code;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          console.log("login Data = " + JSON.stringify(data));
          aJaxService.setToken(data.data.token);
          $state.go('main');
        })
        .error(function (data) {
          aJaxService.setToken(undefined);
          utilService.showAlert('登录', '登录失败！');
          $scope.data.showMessage = true;
          $scope.data.message = data.msgc;

        });
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
//        $scope.$digest(); // 通知视图模型的变化
      }, 1000);
    };

    $scope.clearPhone = function () {
      $scope.data.mobile = "";
    };


  });
