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

          $scope.data.showMessage = true;

          if (data.result === 0) {
            $timeout(function () {
              $scope.data.showNextButton = true;
              $scope.data.showGif = false;
              $scope.data.message = "绑定成功";
            }, 2000)
          } else {
            $scope.data.showMessage = true;
            $scope.data.message = data.msgc;
          }

        })
        .error(function (data) {
          utilService.showAlert('配对设备', '配对失败' + data.msgc);
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

  });
