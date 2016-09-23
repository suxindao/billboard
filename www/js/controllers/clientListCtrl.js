angular.module('starter.controllers')

  .controller('ClientCtrl', function ($scope, $state, $ionicActionSheet, $ionicLoading, clientService, utilService, $ionicPopup, T) {

    $scope.data = {
      clients: null,
      showContent: false
    };

    var noClientConfirm = function () {
      utilService.showConfirm(T.T('设备列表'), T.T('没有匹配设备,是否去匹配?'), T.T('确定'), T.T('取消'), function () {
        $state.go("match");
      }, function () {
        $state.go("main");
      });
    }

    var getClientList = function () {

      $ionicLoading.show({
        template: T.T('设备列表加载中')
      });

      clientService.getClients(function (data) {

        if (data !== null && data.length > 0) {
          $scope.data.showContent = true;
          $scope.data.clients = data;
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          noClientConfirm();
        }
        $ionicLoading.hide();
      });
    };

    getClientList();

    $scope.goMain = function () {
      $state.go("main");
    };

    //页面右上角按钮
    $scope.menu = function (clientID) {

      // $scope.data.clients.forEach(function (client) {
      //   if (client.id == clientID) {
      //     client.chose = !client.chose;
      //     console.log("clientID = " + clientID);
      //     return;
      //   }
      // });

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

              $scope.changeName(clientID);

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
    // function resetChose() {
    //   $scope.data.clients.forEach(function (client) {
    //     client.chose = null;
    //   });
    // }

    function updateLocalName(clientID, name) {
      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID)
          client.name = name;
      });
    }

    function getLocalName(clientID) {
      var name;

      $scope.data.clients.forEach(function (client) {
        if (client.id == clientID) {
          name = client.name;
        }
      });

      console.log(name);
      return name;

      // var client;
      // var res = $scope.data.clients.find(client => client.id == clientID);
      // return res ? res.name : res;
    }

    $scope.changeName = function (clientID) {

      $scope.data.name = getLocalName(clientID);

      $ionicPopup.show({
        cssClass: 'iptTop',
        template: '<input type="text" maxlength="12" ng-model="data.name" auto-focus>',
        title: T.T('请输入新设备名'),
        /*subTitle: '请输入新设备名',*/
        scope: $scope,
        buttons: [
          {text: T.T('取消')}, {
            text: '<b>' + T.T('确定') + '</b>',
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
              // utilService.showAlert('修改成功', '修改成功', function () {
              //   updateLocalName(clientID, res);
              // });
              updateLocalName(clientID, res);
              utilService.alertTimeout(T.T('修改成功！'), 2000);

            })
            .error(function (data) {
              // utilService.showAlert('修改失败');
              utilService.alertTimeout(T.T('修改失败'), 2000);
            });
        } else {
          console.log("放弃修改/名字未修改");
        }
        // resetChose();
      });

    };

    $scope.unbind = function (clientID) {
      $scope.data.name = getLocalName(clientID);

      var okConfirm = function (res) {
        if (res) {
          clientService.unbind(clientID)
            .success(function () {

              $scope.removeClient(clientID);

              utilService.alertTimeout(T.T('解绑成功！'), 2000, function () {
                if ($scope.data.clients.length == 0) {
                  noClientConfirm();
                }
              });

            })
            .error(function (data) {
              utilService.alertTimeout(T.T('解绑失败'), 2000);
            });
        } else {
          console.log("放弃解除绑定设备");
        }
      }

      utilService.showConfirm(T.T("解除设备"), T.T("确定解除设备") + $scope.data.name + T.T("吗?"), T.T("确定"), T.T("取消"), okConfirm, null, $scope);

    };

    $scope.doRefresh = function () {
      getClientList();
    }

    $scope.removeClient = function (clientID) {
      var index = $scope.data.clients.findIndex(function (client) {
        return client.id == clientID;
      });

      $scope.data.clients.splice(index, 1);
    }

  });

