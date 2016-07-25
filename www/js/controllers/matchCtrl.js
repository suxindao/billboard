/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('MatchCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state, $timeout) {

    init();

    //设备配对
    $scope.clientBind = function () {

      $scope.data.showGif = true;

      var requestUrl = "?cmd=clientBind&token=" + aJaxService.getToken() + "&id=" + $scope.data.clientID + "&name=" + $scope.data.clientID;

      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          console.log("Data = " + JSON.stringify(data));

          $timeout(function () {
            $scope.data.showMessage = true;
            $scope.data.showGif = false;
            if (data.result === 0) {
              $scope.data.showNextButton = true;
              $scope.data.message = "绑定成功";
            } else {
              $scope.data.message = data.msgc;
            }
          }, 2000)

        })
        .error(function (data) {
          // utilService.showAlert('配对设备', '配对失败' + data.msgc);
          $timeout(function () {
            $scope.data.showGif = false;
            $scope.data.showMessage = true;
            $scope.data.message = "设备配对失败";
          }, 2000)
        });
    };

    $scope.goList = function () {
      init();
      $state.go('clientList');
    };

    function init() {
      $scope.data = {
        showMessage: false,
        showNextButton: false,
        showGif: false
      };
    }
    ;

    $scope.goMain = function () {
      init();
      $state.go('main');
    };

  });
