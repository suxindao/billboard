/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

.controller('ClientCtrl', function($scope, $state, $ionicActionSheet, $ionicLoading, clientService, utilService, $ionicPopup) {

    $scope.data = {
        clients: null,
        showContent: false
    };


    // Setup the loader
    $ionicLoading.show({
        content: '内容加载中',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    clientService.getClients(function(data) {
        $ionicLoading.hide();
        if (data !== null && data.length > 0) {
            $scope.data.showContent = true;
            $scope.data.clients = data;
        } else {
            utilService.showConfirm('设备列表', '没有匹配设备,是否去匹配?', '确定', '取消', function() {
                $state.go("match");
            });
        }
    });


    $scope.updateSlide = function(index) {
        $scope.slider.slideTo(index, 500, null);
        //      dataChangeHandler();
    };

    //页面右上角按钮
    $scope.menu = function(clientID) {

        $scope.data.name = getLocalName(clientID);

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "修改设备名称" }
            ],
            cancelText: "关闭菜单",
            buttonClicked: function(index) {

                switch (index) {
                    case 0: //修改设备名称

                        $ionicPopup.show({
                            template: '<input type="text" ng-model="data.name">',
                            title: '修改设备名',
                            subTitle: '请输入新设备名',
                            scope: $scope,
                            buttons: [
                                { text: '取消' }, {
                                    text: '<b>确定</b>',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                        if (!$scope.data.name) {
                                            //don't allow the user to close unless he enters wifi password
                                            e.preventDefault();
                                        } else {
                                            return $scope.data.name;
                                        }
                                    }
                                }
                            ]
                        }).then(function(res) {
                            console.log('id = ' + clientID + " name = " + res);
                            if (res) {
                                clientService.rename(clientID, res)
                                    .success(function() {
                                        utilService.showAlert('修改成功', '修改成功', function() {
                                            updateLocalName(clientID, res);
                                        });
                                    })
                                    .error(function(data) {
                                        utilService.showAlert('发布失败', data);
                                    });
                            }
                        });

                        break;
                    case 1: //解除绑定

                        break;
                }
                return true;
            }
        });

        //      $timeout(function () {
        //        hideSheet();
        //      }, 5000);

    };


    function updateLocalName(clientID, name) {
        $scope.data.clients.forEach(function(client) {
            if (client.id == clientID)
                client.name = name;
        });
    }

    function getLocalName(clientID) {
        var name;


        $scope.data.clients.forEach(function(client) {
            console.log(client.id);
            if (parseInt(client.id) == parseInt(clientID)) {
                name = client.name;
            };
        });

        return name;
    }

});
