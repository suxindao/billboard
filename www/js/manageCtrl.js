/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ManageCtrl', function ($scope, $state, $timeout, $ionicActionSheet, $ionicLoading, contentService, utilService, $cordovaInAppBrowser) {

    $scope.options = {
      loopSize: 5
    };

    $scope.data = {
      galleryTop: null,
      galleryThumbs: null,
      photos: null,
      showContent: 0 //0:初始值, 1:获取正确内容, 2:获取无内容,或者删除后无内容
    };

    $scope.toMainPage = function () {
      $state.go("main");
    };


    //首次加载,获取服务器数据
    if ($scope.data.photos === null) {
      // Setup the loader
      $ionicLoading.show({
        content: '内容加载中'
        // animation: 'fade-in',
        // showBackdrop: true,
        // maxWidth: 200,
        // showDelay: 0
      });

      contentService.getOnlineContents(function (data) {
        if (data !== null && data.length > 0) {
          $scope.data.showContent = 1;
          $scope.data.photos = data;
//          dataInit($scope.data.photos); //计算图片的分别率,选择CSS
        } else {
          $scope.data.showContent = 2;
          utilService.showConfirm('内容管理', '没有节目内容,是否去创建?', '确定', '取消',
            function () {
              $state.go("makeVideo", {getPremission: true});
              return;
            },
            function () {
              $state.go("main");
            }
          );
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
          var slideIndex = $scope.galleryActiveIndex();
          var content_ID = $scope.data.photos[slideIndex].id;
          var previewUrl = $scope.data.photos[slideIndex].preview_url;

          switch (index) {
            case 0: //预览

              var options = {
                location: "no"
              };
              $cordovaInAppBrowser.open(previewUrl, '_blank', options).then(function () {
                console.log("InAppBrowser opened " + previewUrl + " successfully");
              }, function (error) {
                console.log("Error: " + error);
              });


              break;
            case 1: //立即发布
              $state.go('choseClient', {contentid: content_ID});
              break;
            case 2: //删除节目

              contentService.removeContents(content_ID)
                .success(function () {
                  utilService.showAlert('删除成功', '删除成功', function () {
                    $scope.data.photos.splice(slideIndex, 1);
                    galleryInit();
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
      galleryInit();
    });

    var galleryInit = function () {
      if ($scope.data.photos.length > $scope.options.loopSize) {

        $scope.data.galleryTop = new Swiper('.gallery-top', {
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          loop: true,
          loopedSlides: $scope.data.photos.length, //looped slides should be the same
          spaceBetween: 10
        });

        $scope.data.galleryThumbs = new Swiper('.gallery-thumbs', {
          centeredSlides: false,
          loop: true,
          loopedSlides: $scope.data.photos.length, //looped slides should be the same
          slidesPerView: 'auto',
          touchRatio: 0.2,
          slideToClickedSlide: true
        });

      } else {

        $scope.data.galleryTop = new Swiper('.gallery-top', {
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          spaceBetween: 10
        });

        $scope.data.galleryThumbs = new Swiper('.gallery-thumbs', {
          centeredSlides: true,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          slideToClickedSlide: true
        });

        document.getElementById("galleryThumbs").className = "swiper-wrapper absro pmzero row alignedCSS";
      }


      $scope.data.galleryTop.params.control = $scope.data.galleryThumbs;
      $scope.data.galleryThumbs.params.control = $scope.data.galleryTop;

      // Add one more handler for this event
      $scope.data.galleryTop.on('slideChangeEnd', function () {
        console.log('galleryTop activeIndex = ' + $scope.galleryActiveIndex());
      });

      $scope.data.galleryThumbs.on('slideChangeEnd', function () {
        console.log('galleryThumbs activeIndex = ' + $scope.data.galleryThumbs.activeIndex);
      });

    }

    $scope.galleryActiveIndex = function () {
      var activeIndex = $scope.data.galleryTop.activeIndex;
      if ($scope.data.photos.length > $scope.options.loopSize) {
        activeIndex -= $scope.data.galleryTop.loopedSlides;
      }
      // alert(activeIndex);
      return activeIndex;
    }
  });
