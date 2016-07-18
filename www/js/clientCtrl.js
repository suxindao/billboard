/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ClientCtrl', function ($scope, $state, $ionicActionSheet, $ionicLoading, clientService, utilService, $ionicPopup) {

    $scope.data = {
      clients: null,
      showContent: false
    };


    // Setup the loader
    $ionicLoading.show({
      content: '设备列表加载中'
    });

    clientService.getClients(function (data) {

      if (data !== null && data.length > 0) {
        $scope.data.showContent = true;
        $scope.data.clients = data;
      } else {
        utilService.showConfirm('设备列表', '没有匹配设备,是否去匹配?', '确定', '取消', function () {
          $state.go("match");
        }, function () {
          $state.go("main");
        });
      }
      $ionicLoading.hide();

    });

    $scope.goMain = function () {
      $state.go("main");
    };

    //页面右上角按钮
    $scope.menu = function (clientID) {

      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID) {
          client.chose = !client.chose;
          console.log("clientID = " + clientID);
          return;
        }
      });

      $scope.data.name = getLocalName(clientID);

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: "<i class='qukdel'>修改设备名称</i>"}
        ],
        cancelText: "关闭菜单",
        cssClass: 'bton_style',
        buttonClicked: function (index) {

          switch (index) {
            case 0: //修改设备名称

              $ionicPopup.show({
                template: '<input type="text" ng-model="data.name">',
                title: '修改设备名',
                subTitle: '请输入新设备名',
                scope: $scope,
                buttons: [
                  {text: '取消'}, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                      if (!$scope.data.name) {
                        e.preventDefault();
                      } else {
                        return $scope.data.name;
                      }
                    }
                  }
                ]
              }).then(function (res) {
                console.log('id = ' + clientID + " name = " + res);
                if (res) {
                  clientService.rename(clientID, res)
                    .success(function () {
                      utilService.showAlert('修改成功', '修改成功', function () {
                        updateLocalName(clientID, res);
                      });
                    })
                    .error(function (data) {
                      utilService.showAlert('修改失败', data);
                    });
                } else {
                  console.log("放弃修改/名字未修改");
                }
                resetChose();
              });

              break;
            case 1: //解除绑定
              break;
          }
          return true;
        },
        cancel: function () {
          console.log("Close Menu");
          resetChose();
        }
      });

      //      $timeout(function () {
      //        hideSheet();
      //      }, 5000);

    };

    //充值选中列表
    function resetChose() {
      $scope.data.clients.forEach(function (client) {
        client.chose = null;
      });
    }

    function updateLocalName(clientID, name) {
      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID)
          client.name = name;
      });
    }

    function getLocalName(clientID) {
      var name;

      $scope.data.clients.forEach(function (client) {
        console.log(client.name);
        if (client.id == clientID) {
          name = client.name;
        }
      });

      return name;

//      var client;
//      var res = $scope.data.clients.find(client => client.id == clientID);
//      return res ? res.name : res;
    }


  });
