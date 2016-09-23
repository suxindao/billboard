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
