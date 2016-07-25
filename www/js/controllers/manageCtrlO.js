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
          data = [{"id": "189", "name": "\u811a\u540e\u8ddf", "resolution": "1080*1920", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/189.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/189.jpg", "update_date": "2016-06-08 15:03:54", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=189&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503450871.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503493371.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503522120.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503524464.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503523995.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606081503522433.jpg"]}, {"id": "175", "name": "\u4f60\u4e5f\u5728\u90a3\u65f6\u5019\u673a", "resolution": "1080*1920", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/175.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/175.jpg", "update_date": "2016-06-06 10:02:40", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=175&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002375233.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002328046.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002322578.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002334765.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002308828.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201606061002330546.jpg"]}, {"id": "164", "name": "\u82b1\u8d39\u5f88\u4e45", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/164.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/164.jpg", "update_date": "2016-05-30 18:05:20", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=164&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605301003493511.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605301003487105.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605301003481324.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605301805184050.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605301005427239.jpg"]}, {"id": "141", "name": "\u82f1\u8bed", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/141.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/141.jpg", "update_date": "2016-05-25 17:16:09", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=141&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605251028119467.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605251716075008.jpg"]}, {"id": "127", "name": "\u7531\u4e8e", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/127.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/127.jpg", "update_date": "2016-05-24 15:37:12", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=127&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605231654118239.jpg", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605231701107395.jpg"]}, {"id": "126", "name": "\u8fc7\u540e\u56de\u5bb6", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/126.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/126.jpg", "update_date": "2016-05-24 15:35:15", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=126&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605241518165948.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605240041012075.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605231654118239.jpg"]}, {"id": "125", "name": "\u54c8\u54c8\u54c8\u5c31", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/125.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/125.jpg", "update_date": "2016-05-24 15:33:10", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=125&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605241356096818.png"]}, {"id": "124", "name": "\u54c8\u54c8\u54c8\u54c8", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/124.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/124.jpg", "update_date": "2016-05-24 15:31:56", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=124&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605241518165948.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605240041012075.png"]}, {"id": "123", "name": "UU\u5c31\u7ecf\u6d4e", "resolution": "600*1024", "preview_image": "http:\/\/www.zettaly.com.cn\/program_img\/123.jpg", "first_image": "http:\/\/www.zettaly.com.cn\/program_img\/123.jpg", "update_date": "2016-05-24 15:18:18", "type": "1", "preview_url": "http:\/\/123.56.136.253:33380\/Webedit\/ProjectPreview.aspx?id=123&resolution=1080*1920", "image": ["http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605241518165948.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605241356096818.png", "http:\/\/123.56.136.253:33380\/Project\/UserImages\/201605240041012075.png"]}];
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
