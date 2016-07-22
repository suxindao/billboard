/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ChoseClientCtrl', function ($scope, $state, $stateParams, $ionicActionSheet, contentService, $ionicLoading, clientService, utilService) {

    $scope.data = {
      clients: null,
      showContent: false
    };


    console.log("Content ID : " + $stateParams.contentid);
    $scope.contentid = $stateParams.contentid;

    // Setup the loader
    $ionicLoading.show({
      content: '设备列表加载中'
    });

    clientService.getClients(function (data) {
      if (data !== null && data.length > 0) {
        $scope.data.showContent = true;
        $scope.data.clients = data;
      } else {
        utilService.showConfirm('设备列表', '没有匹配设备,是否去匹配?', '确定', '取消',
          function () {
            $state.go("match");
          },
          function () {
            $state.go("main");
          }
        );
      }
      $ionicLoading.hide();
    });

    $scope.goMain = function () {
      $state.go("main");
    };

    //页面右上角按钮
    $scope.menu = function (clientID) {
      var ids = getChoseClientids();

      if (ids.length > 0) {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: "立即发布"}
          ],
          cancelText: "关闭菜单",
          buttonClicked: function (index) {

            switch (index) {
              case 0: //立即发布

                contentService.publishContents($scope.contentid, ids)
                  .success(function () {
                    utilService.showAlert('发布成功', '发布成功', function () {
                      $state.go("manage");
                    });
                  })
                  .error(function (data) {
                    utilService.showAlert('发布失败', data);
                  });
                break;
            }
            return true;
          }
        });
      } else {
        utilService.showAlert('内容发布', '请选择设备');
      }

    };

    $scope.chose = function (clientID) {
      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID) {
          client.chose = !client.chose;
          console.log("clientID = " + clientID);
          return;
        }
      });
    };

    function getChoseClientids() {
      var ids = "";
      $scope.data.clients.forEach(function (client) {
        if (client.chose) {
          ids += client.id + ",";
        }
      });

      return ids.substring(0, ids.length - 1);
    }


    //页面右上角按钮
    $scope.sendVideo = function () {
      var ids = getChoseClientids();

      if (ids.length > 0) {

        contentService.publishContents($scope.contentid, ids)
          .success(function () {
            utilService.showAlert('发布成功', '发布成功', function () {
              $state.go("main");
            });
          })
          .error(function (data) {
            utilService.showAlert('发布失败', data);
          });

      } else {
        utilService.showAlert('内容发布', '请选择设备');
      }

    };

  });