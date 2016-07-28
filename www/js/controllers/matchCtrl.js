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

      utilService.showLoading("设备匹配中，请稍候...");

      $scope.data.showGif = true;

      var requestUrl = "?cmd=clientBind&token=" + aJaxService.getToken() + "&id=" + $scope.data.clientID + "&name=" + $scope.data.clientID;

      aJaxService.httpGetData(requestUrl)
        .success(function (data) {

          console.log("Data = " + JSON.stringify(data));

          $timeout(function () {
            $scope.data.showGif = false;
            utilService.hideLoading();

            if (data.result === 0) {
              $scope.data.showNextButton = true;
              $scope.data.message = "绑定成功";

              utilService.alertTimeout('绑定成功', 2000, function () {
                $state.go("clientList");
              });
            } else {
              $scope.data.message = data.msgc;
            }
          }, 2000)

        })
        .error(function (data) {
          // utilService.showAlert('配对设备', '配对失败' + data.msgc);

          $timeout(function () {
            $scope.data.showGif = false;
            $scope.data.message = "设备配对失败";
            utilService.hideLoading();
          }, 2000)
        });
    };

    $scope.goList = function () {
      init();
      $state.go('clientList');
    };

    function init() {
      $scope.data = {
        focusInput: false,
        message: "",
        showNextButton: false,
        showGif: false
      };
    }

    $scope.goMain = function () {
      init();
      $state.go('main');
    };

  });
