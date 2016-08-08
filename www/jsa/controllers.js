/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('AdminCtrl', function ($scope, aJaxService, utilService, $state, $ionicLoading) {

    $scope.user = {};

    // Setup the loader
    $ionicLoading.show({
      content: '加载中'
    });

    var requestUrl = "?cmd=customDetail&token=" + aJaxService.getToken();
    aJaxService.httpGetData(requestUrl)
      .success(function (data) {
        $scope.user = data.data;
        $ionicLoading.hide();
      })
      .error(function (data) {
        $ionicLoading.hide();
        utilService.showAlert('获取信息失败', '获取用户信息失败！请重新获取！');
        $state.go("main");
      });

    $scope.logout = function () {

      utilService.showConfirm('取消登录', '确认登出吗?', '确定', '取消', function () {
        aJaxService.logout()
          .success(function (data) {
            $state.go("login");
          });
      });

    };

    $scope.toMainPage = function () {
      $state.go("main");
    };

    $scope.goManage = function () {
      $state.go("manage");
    };

    $scope.goClientList = function () {
      $state.go("clientList");
    };

  });

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
            {text: "立即发布"}
          ],
          cancelText: "关闭菜单",
          buttonClicked: function (index) {

            switch (index) {
              case 0: //立即发布

                contentService.publishContents($scope.contentid, ids)
                  .success(function () {
                    // utilService.showAlert('发布成功', '发布成功', function () {
                    //   $state.go("manage");
                    // });
                    utilService.alertTimeout('发布成功！', 2000, function () {
                      $state.go("manage");
                    });
                  })
                  .error(function (data) {
                    utilService.showAlert('发布失败');
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

        utilService.showLoading("节目发布中，请稍候...");

        contentService.publishContents($scope.contentid, ids)
          .success(function () {
            // utilService.showAlert('发布成功', '发布成功', function () {
            //   $state.go("main");
            // });
            utilService.hideLoading();
            utilService.alertTimeout('发布成功！', 2000, function () {
              $state.go("manage");
            });
          })
          .error(function (data) {
            utilService.hideLoading();
            utilService.showAlert('发布失败');
          });

      } else {
        utilService.showAlert('内容发布', '请选择设备');
      }

    };

  });

angular.module('starter.controllers')

  .controller('ClientCtrl', function ($scope, $state, $ionicActionSheet, $ionicLoading, clientService, utilService, $ionicPopup) {

    $scope.data = {
      clients: null,
      showContent: false
    };

    var noClientConfirm = function () {
      utilService.showConfirm('设备列表', '没有匹配设备,是否去匹配?', '确定', '取消', function () {
        $state.go("match");
      }, function () {
        $state.go("main");
      });
    }

    var getClientList = function () {

      $ionicLoading.show({
        template: '设备列表加载中'
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
        title: '请输入新设备名',
        /*subTitle: '请输入新设备名',*/
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
              // utilService.showAlert('修改成功', '修改成功', function () {
              //   updateLocalName(clientID, res);
              // });
              updateLocalName(clientID, res);
              utilService.alertTimeout('修改成功！', 2000);

            })
            .error(function (data) {
              // utilService.showAlert('修改失败');
              utilService.alertTimeout('修改失败', 2000);
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

              utilService.alertTimeout('解绑成功！', 2000, function () {
                if ($scope.data.clients.length == 0) {
                  noClientConfirm();
                }
              });

            })
            .error(function (data) {
              utilService.alertTimeout('解绑失败', 2000);
            });
        } else {
          console.log("放弃解除绑定设备");
        }
      }

      utilService.showConfirm("解除设备", "确定解除设备 " + $scope.data.name + "吗?", "确定", "取消", okConfirm, null, $scope);

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


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('LoginCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state, $interval) {
    $scope.data = {
      countdown: 60,
      showMessage: false,
      showCountNumber: false,
      vaildButton: false
    };

    var countdownInit = function () {
      $scope.data.countdown = 60;
      $scope.data.showCountNumber = false;
    };

    countdownInit();

    $scope.loginSendSMSCode = function () {

      if (!utilService.checkMobile($scope.data.mobile)) {
        utilService.showAlert('提示', '不是完整的11位手机号或者正确的手机号前七位！');
        return;
      }

      var requestUrl = "?cmd=loginOrRegSendSMSCode&mobile=" + $scope.data.mobile;
      myTime();
      $scope.data.showMessage = true;
      $scope.data.showCountNumber = true;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          $scope.data.vaildButton = true;
          $scope.data.message = "验证码已发送";
        })
        .error(function (data) {
          utilService.showAlert('获取失败', '获取验证码失败！请重新获取！');
          $scope.data.message = data.msgc;
        });


    };

    $scope.loginWithSMSCode = function () {

//      if (!$scope.data.vaildButton)
//        return;

      if (!utilService.checkMobile($scope.data.mobile)) {
        utilService.showAlert('提示', '请输入正确的手机号码！');
        return;
      }

      if (!utilService.checkSMSCode($scope.data.code)) {
        utilService.showAlert('提示', '短信验证码格式不正确!');
        return;
      }

      var requestUrl = "?cmd=loginOrRegWithSMSCode&mobile=" + $scope.data.mobile + "&code=" + $scope.data.code;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          console.log("login Data = " + JSON.stringify(data));
          aJaxService.setToken(data.data.token);
          $state.go('main');
        })
        .error(function (data) {
          aJaxService.setToken(undefined);
          utilService.showAlert('登录', '登录失败！');
          $scope.data.showMessage = true;
          $scope.data.message = data.msgc;

        });
    };

    var timePromise;
    var myTime = function () {
      timePromise = $interval(function () {
        $scope.data.countdown--;
        if ($scope.data.countdown === 0) {
          countdownInit();
          $interval.cancel(timePromise);
//          $scope.data.showMessage = false;
        }
//        $scope.$digest(); // 通知视图模型的变化
      }, 1000);
    };

    $scope.clearPhone = function () {
      $scope.data.mobile = "";
    };


  });

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('MainCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state, $ionicLoading) {

    $scope.clickPost = function () {

//                var resutls=[{"filePath":"img/jmmg.png","md5":"875EFC59FBDF6B27477DD222CAA46D89"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"}];
//
//               $state.go("makeVideo",{"data":resutls});
//


      $state.go("makeVideo");
    };

    $scope.goManage = function () {
      $state.go("manage");
    };

    $scope.goDevice = function () {
      $state.go("clientList");
    };

    $scope.goAdmin = function () {
      $state.go("admin");
    };

    $scope.goTest = function () {
      $ionicLoading.show({
        template: '内容加载中',
        // animation: 'fade-in',
        // showBackdrop: true,
        // maxWidth: 200,
        // showDelay: 0
      });
    };


  });

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('makeVideoCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $ionicLoading, $state, $stateParams,$ionicHistory,$timeout) {



    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
            // (on first time added to DOM and after the view becomes active after cached


      $scope.programData = {"items": []};

      // utilService.selectImage(function (results)
      // {
      //   results=[{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/jnme.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"}];
      //
      //   if (results)
      //   {
      //     //$state.go("makeVideo",{"data":results});
      //
      //     init(results);
      //
      //     console.log(JSON.stringify(results));
      //   }else
      //   {
      //     $ionicHistory.goBack();
      //
      //
      //   }
      //
      // });

      utilService.hasReadExternalStoragePermissions(function(ret)
              {
                if(ret == 1)
                {

                  $scope.programData = {"items": []};

                  utilService.selectImage(function (results)
                  {
                     //results=[{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/jnme.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"}];

                    if (results)
                    {
                      //$state.go("makeVideo",{"data":results});

                      init(results);

                      console.log(JSON.stringify(results));
                    }else
                    {
                       $ionicHistory.goBack();


                    }

                  });

                }else
                {
                    $ionicHistory.goBack();
                }

              });



    });


    var init = function (results)
    {

      $scope.programData = {};

      $scope.programData.totaltime = 10;

      var items = [];

      for (var i = 0; i < results.length; i++)
      {
        var data = results[i];

        data.playtime = $scope.programData.totaltime / results.length;
        data.playtime = Math.round(data.playtime);

        if (i == 2 || i == 5)
          data.line = false;
        else
          data.line = true;

        items.push(data);
      }

      $scope.programData.items = items;

      $scope.currentIndex = undefined;

      $scope.$apply();
    }


    $scope.clickItem = function (index, event)
    {
      $scope.currentIndex = index;

      for (var i = 0; i < $scope.programData.items.length; i++)
      {
        if (index == i)
          $scope.programData.items[i].selected = true;
        else
          $scope.programData.items[i].selected = false;

      }


    }

    $scope.clickPlayTurn = function ()
    {
      utilService.showPopup("请输入轮播的总时长(秒)", "", function (t)
      {
        if (!t || t < 0)
        {
          return;
        }
        setTotalTime(t);
      }, $scope,"number");

    }

    $scope.clickCustom = function ()
    {
      if ($scope.currentIndex == undefined)
      {
        utilService.alertTimeout('请选择图片进行设置！',2000);
        return;
      }

      utilService.showPopup("请输入播放时间(秒)", "", function (t)
      {
        if (!t || t < 0)
        {
          //showAlert("请输入时间");
          return;
        }
        setItemTime(t);
      }, $scope,"number");
    }

    $scope.startMaking = function ()
    {
      utilService.showPopup("请输入节目名称", "", function (t)
      {
        if (t && t.length > 0)
        {
          createProgram(t);
        }

      }, $scope, "text");
    }

    $scope.toMainPage = function ()
    {
      $state.go("main");
    }

    var getPostImageList = function (sendImgInfo)
    {
      var newItems = [];

      var items = $scope.programData.items;

      var found = false;

      for (var i = 0; i < items.length; i++)
      {
        if (sendImgInfo[i].id == "")
        {
          newItems.push(items[i]);
        }

      }

      return newItems;
    }

    var doCreate = function (programData, callback)
    {
      aJaxService.createProgram(programData, function (data)
      {
        if (data)
        {
          console.log(JSON.stringify(data));

          if (callback)
          {
            callback(data);
          }



        } else
        {
          if (callback)
          {
            callback(undefined);
          }


        }

      });
    }

    var createProgram = function (name)
    {
      utilService.showLoading("节目制作中，请稍候...");

      $scope.programData.name = name;

      aJaxService.existFileMD5s($scope.programData.items, function (data) {
        if (data)
        {

          var items = getPostImageList(data.data);

          var postCount = 0;

          var itemLength = items.length;

          if (itemLength == 0)
          {
            doCreate($scope.programData, function (ret)
            {
              if (ret)
              {

                utilService.showAlert("","制作节目成功！", function ()
                {
                  $state.go("manage");
                });


              } else
              {
                utilService.showAlert("","制作节目失败！");
              }

               utilService.hideLoading();
            });
            return;
          }

          for (var i = 0; i < itemLength; i++)
          {
            aJaxService.postImage(items[i], function (data)
            {
              if (data)
              {
                postCount++;

                if (postCount == itemLength)
                {

                  doCreate($scope.programData, function (ret)
                  {
                    if (ret)
                    {
                      utilService.showAlert("","制作节目成功！", function ()
                      {
                        $state.go("manage");
                      });

                    } else
                    {
                      utilService.showAlert("","制作节目失败！");
                    }

                   utilService.hideLoading();
                  });
                }

              } else
              {
                 utilService.hideLoading();
                console.log("上传图片失败");
              }


            });
          }//
        } else
        {
          utilService.hideLoading();
          utilService.showAlert("上传图失败！");
        }


      });




    }


    var setItemTime = function (t)
    {

      if ($scope.currentIndex != undefined)
      {
        var data = $scope.programData.items[$scope.currentIndex];
        var oldtime = data.playtime;
        data.playtime = t;

        $scope.programData.totaltime += data.playtime - oldtime;
      }
    }

    var setTotalTime = function (t)
    {
      $scope.programData.totaltime = t;

      for (var i = 0; i < $scope.programData.items.length; i++)
      {
        var data = $scope.programData.items[i];

        data.playtime = $scope.programData.totaltime / $scope.programData.items.length;

        data.playtime = Math.round(data.playtime);


      }


    }

//    var showAlert=function(title,callback)
//    {
//         var alertPopup = $ionicPopup.alert({
//                title: '提示',
//                template: title
//              });
//              alertPopup.then(function(res) {
//                console.log('Thank you for not eating my delicious ice cream cone');
//                if(callback)
//                    callback();
//              });
//    }
//
//    var showPopup = function(title,subtitle,callback,inputType) {
//
//              $scope.data={}
//
//             if(inputType == undefined)
//             {
//                 inputType="number";
//             }
//             // 自定义弹窗
//             var myPopup = $ionicPopup.show({
//               template: '<input type="' +inputType+'" ng-model="data.value">',
//              title: title,
//              subTitle: subtitle,
//              scope: $scope,
//              buttons: [
//                { text: '取消' },
//                {
//                  text: '<b>确定</b>',
//                  type: 'button-positive',
//                  onTap: function(e) {
//                   return $scope.data.value;
//                  }
//                },
//              ]
//            });
//
//
//            myPopup.then(function(res) {
//                if(callback)
//                    callback(res);
//              console.log('Tapped!', res);
//            });
//
//   }

  });

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ManageCtrl', function ($scope, $state, $timeout, $ionicActionSheet, $ionicLoading, contentService, utilService, $cordovaInAppBrowser, $ionicPopup) {

    $scope.data = {
      galleryTop: null,
      galleryThumbs: null,
      photos: null,
      deleteAll: '0',
      showContent: 0 //0:初始值, 1:获取正确内容, 2:获取无内容,或者删除后无内容
    };

    $scope.toMainPage = function () {
      $state.go("main");
    };


    //首次加载,获取服务器数据
    if ($scope.data.photos === null) {
      // Setup the loader
      $ionicLoading.show({
        template: '内容加载中',
        // animation: 'fade-in',
        // showBackdrop: true,
        // maxWidth: 200,
        // showDelay: 0
      });

      contentService.getOnlineContents(function (data) {

        $ionicLoading.hide();

        if (data !== null) {
          if (data.length > 0) {
            $scope.data.showContent = 1;
            $scope.data.photos = data;
            console.log("节目长度:" + $scope.data.photos.length);
//          dataInit($scope.data.photos); //计算图片的分别率,选择CSS
          } else { //没有节目内容
            $scope.data.showContent = 2;
            $scope.noContentConfirm();
          }
        } else { //网络错误
          utilService.showAlert('内容获取失败');
        }

      });
    }

    //页面右上角按钮
    $scope.menu = function () {

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: "<div class='qukdel topquck'>预览节目</div>"},
          {text: "<div class='conquck'>立即发布</div>"},
          {text: "<div class='qukdel btmquck'>删除节目</div>"}
        ],
        cancelText: "关闭菜单",
        cssClass: 'bton_style',
        buttonClicked: function (index) {
          switch (index) {
            case 0: //预览
              $scope.preViewUrl();
              break;

            case 1: //立即发布
              $scope.publishContent();
              break;

            case 2: //删除节目
              $scope.removeContent();
              break;
          }
          return true;
        }
      });

      /*
       $timeout(function () {
       hideSheet();
       }, 3000);
       */

    };

    function dataInit(data) {
      data.forEach(function (client) {
        var newRes = client.resolution.split("*");
        console.log("resolution:" + client.resolution + " = " + (newRes[0] / newRes[1]).toFixed(1));

        var width = parseInt(newRes[0]);
        var height = parseInt(newRes[1]);

        if (width < height) {
          if ((width / height).toFixed(1) == 0.6) {
            client.cssStyle = "trf";
          } else if ((width / height).toFixed(1) == 0.8) {
            client.cssStyle = "sixnie";
          } else {
            client.cssStyle = "ccc";
          }
        } else {
          if ((height / width).toFixed(1) == 0.6) {
            client.cssStyle = "ftr";
          } else if ((height / width).toFixed(1) == 0.8) {
            client.cssStyle = "niesix";
          } else {
            client.cssStyle = "ccc";
          }
        }

        console.log("client.cssStyle = " + client.cssStyle);
      });
    }

    function sortArr(m, n) {
      return m - n;
    }

    $scope.$on('ngRepeatFinished', function () {
      $scope.data.galleryTop = new Swiper('.swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 2,
        centeredSlides: true,
        spaceBetween: 80
        // effect: 'coverflow',
        // coverflow: {
        //   rotate: 50,
        //   stretch: 0,
        //   depth: 100,
        //   modifier: 1,
        //   slideShadows : true
        // }
      });

      // Add one more handler for this event
      // $scope.data.galleryTop.on('slideChangeEnd', function () {
      //   console.log('galleryTop activeIndex = ' + $scope.data.galleryTop.activeIndex);
      // });
    });

    $scope.noContentConfirm = function () {

      var noContentConfirm = utilService.showConfirm('内容管理', '没有节目内容,是否去创建?', '确定', '取消',
        function () {
          $state.go("makeVideo", {getPremission: true});
          return;
        },
        function () {
          $state.go("main");
        }
      );

    };

    $scope.preViewUrl = function () {

      var slideIndex = $scope.data.galleryTop.activeIndex;
      var previewUrl = $scope.data.photos[slideIndex].preview_url;
      var options = {
        location: "no"
      };

      $cordovaInAppBrowser.open(previewUrl, '_blank', options)
        .then(function () {
          console.log("InAppBrowser opened " + previewUrl + " successfully");
        }, function (error) {
          console.log("Error: " + error);
        });

    }

    $scope.publishContent = function (content_ID) {

      var slideIndex = $scope.data.galleryTop.activeIndex;
      var content_ID = $scope.data.photos[slideIndex].id;

      $state.go('choseClient', {contentid: content_ID});

    }

    $scope.removeContent = function () {

      var slideIndex = $scope.data.galleryTop.activeIndex;
      var content_ID = $scope.data.photos[slideIndex].id;

      var confirmOk = function (res) {
        contentService.removeContents(content_ID, $scope.data.deleteAll)
          .success(function () {

            // utilService.showAlert('删除成功', '删除成功', function () {
            //   $scope.data.photos.splice(slideIndex, 1);
            //   // $scope.$emit('ngRepeatFinished');
            //   $scope.data.galleryTop.removeSlide(slideIndex);
            //   $scope.data.deleteAll = '0';
            //   if ($scope.data.photos.length === 0) {
            //     $scope.data.showContent = 2;
            //     $scope.noContentConfirm();
            //   }
            // });

            utilService.alertTimeout('删除成功', 2000, function () {
              $scope.data.photos.splice(slideIndex, 1);
              // $scope.$emit('ngRepeatFinished');
              $scope.data.galleryTop.removeSlide(slideIndex);
              $scope.data.deleteAll = '0';
              if ($scope.data.photos.length === 0) {
                $scope.data.showContent = 2;
                $scope.noContentConfirm();
              }
            });

          })
          .error(function (data) {
            // utilService.showAlert('删除失败', '删除失败');
            utilService.alertTimeout('删除失败', 2000);
          });
      };

      utilService.showConfirm('删除节目',
        '<p class="fxcen"><input class="delput" type="checkbox" ng-model="data.deleteAll" ng-true-value="1" ng-false-value="0"/><span class="textcen">是否同时删除设备上的该节目?</span></p>',
        '确定', '取消', confirmOk, null, $scope);
    }

    $scope.showClientList = function () {

      var slideIndex = $scope.data.galleryTop.activeIndex;
      var clients = $scope.data.photos[slideIndex].client;

      var templates = "";
      if (clients.length > 0) {
        var clients = clients.split(",");

        templates = '<ul class="jmtit">';
        clients.forEach(function (client) {
          templates += '<li class="jmtitli">' + client + '</li>';
        })
        templates += '</ul>';
      } else {
        templates = "未发布";
      }

      var myPopup = $ionicPopup.show({
        template: templates,
        title: '发布设备列表',
        // subTitle: '已发布设备',
        scope: $scope,
        cssClass: "sList",
        buttons: [
          {text: ""},
        ]
      });


    }
  });

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
              $scope.data.message = "配对成功";

              //以下两行直接跳转回设备列表
              utilService.alertTimeout('配对成功', 2000, function () {
                $scope.goList();
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
            $scope.data.message = "配对失败";
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

    $scope.goClientList = function () {
      init();
      $state.go('clientList');
    };

  });

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('testCtrl', function () {


    var galleryTop = new Swiper('.gallery-top', {
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 10,
      loop: true,
      loopedSlides: 5, //looped slides should be the same
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 5,
      touchRatio: 0.2,
      loop: true,
      loopedSlides: 5, //looped slides should be the same
      slideToClickedSlide: true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;




  });
