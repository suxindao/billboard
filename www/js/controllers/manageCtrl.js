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
        content: '内容加载中',
        // animation: 'fade-in',
        // showBackdrop: true,
        // maxWidth: 200,
        // showDelay: 0
      });

      contentService.getOnlineContents(function (data) {
        if (data !== null && data.length > 0) {
          $scope.data.showContent = 1;
          $scope.data.photos = data;
          console.log("节目长度:" + $scope.data.photos.length);
//          dataInit($scope.data.photos); //计算图片的分别率,选择CSS
        } else {
          $scope.data.showContent = 2;
          $scope.noContentConfirm();
        }
        $ionicLoading.hide();
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
        spaceBetween: 50
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

      $cordovaInAppBrowser.open(previewUrl, '_blank', options).then(function () {
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
            utilService.showAlert('删除成功', '删除成功', function () {
              $scope.data.photos.splice(slideIndex, 1);
              // $scope.$emit('ngRepeatFinished');
              $scope.data.galleryTop.removeSlide(slideIndex);
              if ($scope.data.photos.length === 0) {
                $scope.data.showContent = 2;
                $scope.noContentConfirm();
              }
            });
          })
          .error(function (data) {
            utilService.showAlert('删除失败', '删除失败');
          });
      };

      utilService.showConfirm('删除节目',
        '<input type="checkbox" ng-model="data.deleteAll" ng-true-value="1" ng-false-value="0"/>' +
        '是否同时删除设备上的该节目?',
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
        subTitle: '已发布设备',
        scope: $scope,
        cssClass:"sList",
        buttons: [
          { text: "" },
        ]
      });


    }
  });
