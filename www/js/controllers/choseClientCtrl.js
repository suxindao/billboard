/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ChoseClientCtrl', function ($scope, $state, $stateParams, $ionicActionSheet, contentService, $ionicLoading, clientService, utilService, T) {

    $scope.data = {
      clients: null,
      showContent: false
    };


    console.log("Content ID : " + $stateParams.contentid);
    $scope.contentid = $stateParams.contentid;

    // Setup the loader
    $ionicLoading.show({
      content: T.T('设备列表加载中')
    });

    clientService.getClients(function (data) {
      if (data !== null && data.length > 0) {
        $scope.data.showContent = true;
        $scope.data.clients = data;
      } else {
        utilService.showConfirm(T.T('设备列表'), T.T('没有匹配设备,是否去匹配?'), T.T('确定'), T.T('取消'),
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
      $state.go('main');
    };

    $scope.goManage = function () {
      $state.go("manage");
    };

    //页面右上角按钮
    $scope.menu = function (clientID) {
      var ids = getChoseClientids();

      if (ids.length > 0) {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: T.T("立即发布")}
          ],
          cancelText: T.T("关闭菜单"),
          buttonClicked: function (index) {

            switch (index) {
              case 0: //立即发布

                contentService.publishContents($scope.contentid, ids)
                  .success(function () {
                    // utilService.showAlert('发布成功', '发布成功', function () {
                    //   $state.go("manage");
                    // });
                    utilService.alertTimeout(T.T('发布成功！'), 2000, function () {
                      $state.go("manage");
                    });
                  })
                  .error(function (data) {
                    utilService.showAlert(T.T('发布失败'));
                  });
                break;
            }
            return true;
          }
        });
      } else {
        utilService.showAlert(T.T('内容发布'), T.T('请选择设备'));
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

        utilService.showLoading(T.T("节目发布中，请稍候..."));

        contentService.publishContents($scope.contentid, ids)
          .success(function () {
            // utilService.showAlert('发布成功', '发布成功', function () {
            //   $state.go("main");
            // });
            utilService.hideLoading();
            utilService.alertTimeout(T.T('发布成功！'), 2000, function () {
              $state.go("manage");
            });
          })
          .error(function (data) {
            utilService.hideLoading();
            utilService.showAlert(T.T('发布失败'));
          });

      } else {
        utilService.showAlert(T.T('内容发布'), T.T('请选择设备'));
      }

    };

  });
