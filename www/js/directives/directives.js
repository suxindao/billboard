/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.directives')


  .directive('lightslide', function () {
    return {
      restrict: 'ACE',
      template: '<li data-thumb="{{photo.thumbnail}}"><img ng-src="{{photo.fullres}}"/></li>',
      replace: true,
      link: function (scope, element, attrs) {

        if (scope.$last) {
          element.parent().lightSlider({
//            autoWidth: true, //Custom width for each slide
            slideMove: 1, //Number of slides to be moved at a time
            slideMargin: 20, //Spacing between each slide
            addClass: "sxd", //给最外层加css名字
            mode: "slide", //使用的模式, Type of transition 'slide' and 'fade'
            item: 1, //展示图数量
            enableTouch: true, //Enables touch support
            slideEndAnimation: true, //Enable slideEnd animation
//
            gallery: true, //是否使用画廊
            galleryMargin: 100, //Spacing between gallery and slide
//            thumbItem: 10, //缩略图数量
            thumbWidth: 100, //缩略图宽, 似乎不起作用
            thumbMargin: 5, //缩略图间距
            currentPagerPosition: 'middle', //缩略图位置显示: 'left', 'middle', 'right'

            pager: true, //分页
            controls: true, //显示按钮
            prevHtml: '', //上一张按钮html内容
            nextHtml: '', //下一张按钮html内容
            keyPress: true, //支持键盘操作

            useCSS: true, //是否使用CSS样式 If true LightSlider will use CSS transitions. if falls jquery animation will be used.
            cssEasing: 'ease', //Type of easing to be used for css animations
            auto: false, //是否自动播放
            pause: 2000, //播放的间隔时间
            loop: true, //是否循环播入
            easing: '', //使用的动画效果
            speed: 500, //动画时间
            onSliderLoad: function () {
              $('#image-gallery').removeClass('cS-hidden');
            },
            onAfterSlide: function () {

            }
          });
        }

      }
    };
  })

  .directive('lightgallery', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (scope.$last) {
          element.parent().lightGallery();
        }
      }
    };
  })

  .directive('autoFocus', function ($timeout) {
    return {
      restrict: 'AC',
      link: function (_scope, _element) {
        $timeout(function () {
          _element[0].focus();
        }, 1000);
      }
    };
  })

  .directive('flashButton', function ($timeout) {
    return {
      restrict: 'AC',
      link: function (_scope, _element, _attrs) {

        _element.bind("click", function () {
//                        alert(_attrs["class"]);
          _element.addClass(_attrs["flashCss"]);
          $timeout(function () {
            _element.removeClass(_attrs["flashCss"]);
          }, 100);
        });

      }
    };
  })

  .directive('galleryRepeatFinish', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  })

  // .directive('galleryRepeatFinish', function () {
  //   return {
  //     link: function (scope, element, attr) {
  //      console.log(scope.$index + "|" + scope.$last)
  //       if (scope.$last == true) {
  //         console.log('ng-repeat执行完毕');
  //         scope.data.galleryTop = new Swiper('.swiper-container', {
  //           slidesPerView: 3,
  //           centeredSlides: true,
  //           spaceBetween: 10
  //         });
  //
  //         // Add one more handler for this event
  //         scope.data.galleryTop.on('slideChangeEnd', function () {
  //           console.log('galleryTop activeIndex = ' + scope.data.galleryTop.activeIndex);
  //         });
  //       }
  //     }
  //   }
  // })

  .directive('inappbowser', function ($cordovaInAppBrowser) {
    return {
      restrict: 'AC',
      scope: {
        aurl: "@previewUrl"
      },
      link: function (_scope, _element) {
        _element.bind("click", function () {
//          alert(_scope.aurl);
//          $cordovaInAppBrowser.open(_scope.aurl, '_blank', 'location=yes,hidden=yes');


          document.addEventListener('deviceready', function () {

            var options = {
              location: "no"
            };

           
            var inAppBrowserRef = $cordovaInAppBrowser.open(_scope.aurl, '_blank', options).then(function () {
              console.log("InAppBrowser opened " + _scope.aurl + " successfully");
              
            }, function (error) {
              console.log("Error: " + error);
            });
            
            
            inAppBrowserRef.addEventListener("loadstart", function()
            {
                alert("hehe")
                 StatusBar.hide();
            });
            
            inAppBrowserRef.addEventListener("exit", function()
            {
                StatusBar.show();
            });

          }, function () {
            console.log("not ready!!!");
          });


        });
      }
    };
  })

  .directive('languagecss', function ($translate) {
    return {
      restrict: 'A',
      scope: {
        languagecss: "@"
      },
      link: function (_scope, _element) {
        if ($translate.proposedLanguage() == "en")
        _element.attr("href", _scope.languagecss);
      }
    };
  })

;
