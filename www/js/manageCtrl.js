/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ManageCtrl', function ($scope, $state, $timeout, $ionicActionSheet, $ionicLoading, contentService, utilService) {

    $scope.options = {
      loop: false,
      speed: 500,
      hashnav: true
    };

    $scope.data = {
      galleryTop: null,
      galleryThumbs: null,
      photos: null,
      showContent: 0 //0:初始值, 1:获取正确内容, 2:获取无内容,或者删除后无内容 
    };

    //首次加载,获取服务器数据
    if ($scope.data.photos === null) {
      // Setup the loader
      $ionicLoading.show({
        content: '内容加载中',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      contentService.getOnlineContents(function (data) {
        $ionicLoading.hide();
        if (data !== null && data.length > 0) {
          $scope.data.showContent = 1;
          $scope.data.photos = data;
//          dataInit($scope.data.photos); //计算图片的分别率,选择CSS
        } else {
          $scope.data.showContent = 2;
          utilService.showAlert('获取失败', '获取内容失败');
        }
      });
    }

    //页面右上角按钮
    $scope.menu = function () {

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: "立即发布"},
          {text: "删除节目"}
        ],
        cancelText: "关闭菜单",
        buttonClicked: function (index) {
          var slideIndex = $scope.data.galleryTop.activeIndex;
          var content_ID = $scope.data.photos[slideIndex].id;

          switch (index) {
            case 0: //立即发布
              $state.go('choseClient', {contentid: content_ID});
              break;
            case 1: //删除节目

              contentService.removeContents(content_ID)
                .success(function () {
                  utilService.showAlert('删除成功', '删除成功', function () {
                    $scope.data.photos.splice(slideIndex, 1);
                    $scope.data.galleryTop.removeSlide(slideIndex);
                    $scope.data.galleryThumbs.removeSlide(slideIndex);
                    if ($scope.data.photos.length === 0) {
                      $scope.data.showContent = 2;
                    }
                  });
                })
                .error(function (data) {
                  utilService.showAlert('删除失败', '删除失败');
                });

              break;
          }
          return true;
        }
      });

      $timeout(function () {
        hideSheet();
      }, 3000);

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

  });
