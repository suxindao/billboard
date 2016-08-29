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

  .controller('makeVideoCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $ionicLoading, $state, $stateParams,$ionicHistory, $timeout, T) {



    $scope.$on('$ionicView.beforeEnter', function () {
            // update campaigns everytime the view becomes active
            // (on first time added to DOM and after the view becomes active after cached


      $scope.programData = {"items": []};

      /*utilService.selectImage(function (results)
      {
        results=[{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/jnme.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"},{"filePath":"img/home.png"}];

        if (results)
        {
          //$state.go("makeVideo",{"data":results});

          init(results);

          console.log(JSON.stringify(results));
        }else
        {
          $ionicHistory.goBack();


        }

      });*/

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

        if ((i+1) % 3 == 0 )
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
      utilService.showPopup(T.T("请输入轮播的总时长(秒)"), "", function (t)
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
        utilService.alertTimeout(T.T('请选择图片进行设置！'),2000);
        return;
      }

      utilService.showPopup(T.T("请输入播放时间(秒)"), "", function (t)
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
      utilService.showPopup(T.T("请输入节目名称"), "", function (t)
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



    var uploadFiles=function(files,index)
    {
        if(files.length == index)
        {

            doCreate($scope.programData, function (ret)
                  {
                    if (ret)
                    {
                      utilService.showAlert("",T.T("制作节目成功！"), function ()
                      {
                        $state.go("manage");
                      });

                    } else
                    {
                      utilService.showAlert("",T.T("制作节目失败！"));
                    }

                   utilService.hideLoading();

                  });

            return;
        }

        var newIndex=index+1;

         aJaxService.postImage(files[index], function (data)
         {
             if(data)
             {
                 uploadFiles(files,newIndex);

             }else
             {
                  utilService.showAlert("",T.T("制作节目失败！"));
             }

         });

    }

    var createProgram = function (name)
    {
      utilService.showLoading(T.T("节目制作中，请稍候..."));

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

                utilService.showAlert("",T.T("制作节目成功！"), function ()
                {
                  $state.go("manage");
                });


              } else
              {
                utilService.showAlert("",T.T("制作节目失败！"));
              }

               utilService.hideLoading();
            });
            return;
          }

          uploadFiles(items,0);

//          for (var i = 0; i < itemLength; i++)
//          {
//            aJaxService.postImage(items[i], function (data)
//            {
//              if (data)
//              {
//                postCount++;
//
//                if (postCount == itemLength)
//                {
//
//                  doCreate($scope.programData, function (ret)
//                  {
//                    if (ret)
//                    {
//                      utilService.showAlert("","制作节目成功！", function ()
//                      {
//                        $state.go("manage");
//                      });
//
//                    } else
//                    {
//                      utilService.showAlert("","制作节目失败！");
//                    }
//
//                   utilService.hideLoading();
//                  });
//                }
//
//              } else
//              {
//                 utilService.hideLoading();
//                console.log("上传图片失败");
//              }
//
//
//            });
//          }//
        } else
        {
          utilService.hideLoading();
          utilService.showAlert(T.T("上传图失败！"));
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
