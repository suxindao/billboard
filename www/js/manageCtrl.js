/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

  .controller('ManageCtrl', function ($scope, $state, $ionicActionSheet, $timeout, aJaxService, $ionicLoading, $ionicSlideBoxDelegate, contentService, utilService) {

    $scope.swiper_options = {
      loop: false,
      effect: 'coverflow',
      speed: 500,
      showPager: false,
      spaceBetween: 100,
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 2, //这个很关键
      centeredSlides: true,
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }
    };

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
      $scope.$apply();
      console.log('$ionicSlides.sliderInitialized:' + $scope.slider.activeIndex);
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
      console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
      // note: the indexes are 0-based
//      $scope.activeIndex = data.slider.activeIndex;
//      $scope.previousIndex = data.slider.previousIndex;
      console.log('Slide change is ending, previousIndex = ' + $scope.slider.previousIndex);
      console.log('Slide change is ending, activeIndex = ' + $scope.slider.activeIndex);
      $scope.$apply();
    });

    function dataChangeHandler() {
      // call this function when data changes, such as an HTTP request, etc
      if ($scope.slider) {
        $scope.slider.updateLoop();
      }
    }

    $scope.data = {
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
          dataChangeHandler();
        } else {
          $scope.data.showContent = 2;
          utilService.showAlert('获取失败', '获取内容失败');
        }
      });
    }

    $scope.updateSlide = function (index) {
      $scope.slider.slideTo(index, 500, null);
//      dataChangeHandler();
    };

    //页面右上角按钮
    $scope.menu = function () {

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: "立即发布"},
          {text: "删除节目"}
        ],
        cancelText: "关闭菜单",
        buttonClicked: function (index) {
          var slideIndex = $scope.slider.activeIndex;
          var content_ID = $scope.data.photos[slideIndex].id;

          switch (index) {
            case 0: //立即发布

//              contentService.publishContents(content_ID)
//                .success(function () {
//
//                  $ionicPopup.alert({
//                    title: '发布成功',
//                    template: '发布成功'
//                  });
//
//                })
//                .error(function (data) {
//                  $ionicPopup.alert({
//                    title: '发布失败',
//                    template: data
//                  });
//                });
              $state.go('choseClient', {contentid: content_ID});
              break;
            case 1: //删除节目

              contentService.removeContents(content_ID)
                .success(function () {
                  utilService.showAlert('删除成功', '删除成功', function () {
                    $scope.data.photos.splice(slideIndex, 1);
                    if ($scope.data.photos.length === 0) {
                      $scope.data.showContent = 2;
                    } else {
                      dataChangeHandler();
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

//      $timeout(function () {
//        hideSheet();
//      }, 5000);

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
