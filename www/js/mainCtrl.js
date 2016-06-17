/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.controllers')

        .controller('MainCtrl', function ($scope, aJaxService, utilService, $ionicPopup, $state) {

            $scope.options = {
                loop: false,
                speed: 500,
                hashnav: true
            };
//
            $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
                // data.slider is the instance of Swiper
                $scope.slider = data.slider;
            });

            $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
                console.log('Slide change is beginning');
            });

            $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
                // note: the indexes are 0-based
                $scope.activeIndex = data.activeIndex;
                $scope.previousIndex = data.previousIndex;
            });


//            var slider = new ionic.views.Swiper('.swiper-container', $scope.options, $scope, null);

//            $scope.$emit("$ionicSlides.sliderInitialized", {slider: slider});


            var galleryTop = new ionic.views.Swiper('.gallery-top', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 10
            }, $scope, null);

            var galleryThumbs = new ionic.views.Swiper('.gallery-thumbs', {
                centeredSlides: false,
                slidesPerView: 'auto',
                touchRatio: 0.2,
                slideToClickedSlide: true
            }, $scope, null);

            galleryTop.params.control = galleryThumbs;
            galleryThumbs.params.control = galleryTop;

            $scope.clickPost = function ()
            {

//                var resutls=[{"filePath":"img/jmmg.png","md5":"875EFC59FBDF6B27477DD222CAA46D89"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"},{"filePath":"img/jmmg.png","md5":"840436C562495B115A88E153A37696BD"}];
//                
//               $state.go("makeVideo",{"data":resutls});
//                


                $state.go("makeVideo");
            };

        });
