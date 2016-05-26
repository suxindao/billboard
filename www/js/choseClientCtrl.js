/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ChoseClientCtrl', function ($scope, $state, $stateParams, $ionicActionSheet, $timeout, contentService, $ionicLoading, $ionicSlideBoxDelegate, clientService, $ionicPopup) {

    $scope.data = {
      clients: null,
      showContent: false
    };


    console.log("Content ID : " + $stateParams.contentid);
    $scope.contentid = $stateParams.contentid;

    // Setup the loader
    $ionicLoading.show({
      content: '内容加载中',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    clientService.getClients(function (data) {
      $ionicLoading.hide();
      if (data !== null && data.length > 0) {
        $scope.data.showContent = true;
        $scope.data.clients = data;
      } else {
        $ionicPopup.confirm({
          title: '设备列表',
          template: '没有匹配设备,是否去匹配?'
        }).then(function (res) {
          if (res) {
            $state.go("match");
          }
        });
      }
    });

    $scope.updateSlide = function (index) {
      $scope.slider.slideTo(index, 500, null);
//      dataChangeHandler();
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
                    $ionicPopup.alert({
                      title: '发布成功',
                      template: '发布成功'
                    }).then(function () {
                      $state.go("manage");
                    });
                  })
                  .error(function (data) {
                    $ionicPopup.alert({
                      title: '发布失败',
                      template: data
                    });
                  });
                break;
            }
            return true;
          }
        });
      } else {
        $ionicPopup.alert({
          title: '内容发布',
          template: '请选择设备'
        });
      }


    };


    function updateLocalName(clientID, name) {
      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID) {
          client.name = name;
          return;
        }
      });
    }

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


  });
