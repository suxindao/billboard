/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('MatchCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state) {
    
    init();

    //设备配对
    $scope.clientBind = function () {

      var requestUrl = "?cmd=clientBind&token=" + aJaxService.getToken() + "&id=" + $scope.data.clientID + "&name=" + $scope.data.clientID;
//      var requestUrl = "?cmd=clientBind&token=ac7851a74504be7c4bde5da8c41261ec&id=" + $scope.data.clientID + "&name=" + $scope.data.clientID;

      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          console.log("Data = " + JSON.stringify(data));

          $scope.data.showMessage = true;

          if (data.result === 0) {
            $scope.data.showNextButton = true;
            $scope.data.message = "绑定成功";
          } else {
            $scope.data.message = data.msgc;
          }

        })
        .error(function (data) {
          utilService.showAlert('配对设备', '配对失败' + data.msgc);
        });
    };

    $scope.goMain = function () {
      init();
      $state.go('main');
    };

    function init() {
      $scope.data = {
        showMessage: false,
        showNextButton: false
      };
    }
    ;

  });
