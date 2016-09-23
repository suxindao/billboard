// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.directives', 'starter.filters', 'pascalprecht.translate'])

  .run(function ($ImageCacheFactory, $ionicPlatform, $location, $ionicPopup, $rootScope, $state, $stateParams, $ionicHistory, locals, T) {

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: T.T('退出应用'),
          template: T.T('你确定要退出应用吗?'),
          okText: T.T('退出'),
          cancelText:T.T('取消')
        });

        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
      }

      // Is there a page to go back to?
      if ($location.path() == '/main' || $location.path() == '/login') {
        showConfirm();
      } else if ($ionicHistory.backView) {
        // console.log('currentView:', $ionicHistory.currentView);
        // Go back in history
        $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }

      return false;
    }, 101);


    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      
     
    });

    $rootScope.defaultPage = "main";

    $rootScope.user = locals.getObject("user");


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

      if ($rootScope.user.token) {

        if (fromState.url == "/manage" && toState.url == "/makeVideo") {
          if (toParams.getPremission != true) {
            event.preventDefault(); // 取消默认跳转行为
            $state.go($rootScope.defaultPage);
            return;
          }
        } else if (fromState.url == "^" && toState.url != "/main") {
          event.preventDefault(); // 取消默认跳转行为
          fromState.name = $rootScope.defaultPage;
          $state.go($rootScope.defaultPage);
          return;
        } else if (toState.url == "/login") {
          event.preventDefault(); // 取消默认跳转行为
          return;
        }

      } else {
        if (toState.url != "/login") {
          event.preventDefault(); // 取消默认跳转行为
          $state.go("login"); //跳转到登录界面
          return;
        }
      }

    });


  })

  .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaInAppBrowserProvider, $translateProvider, _translate_EN) {

    $translateProvider.translations('en', _translate_EN);

    $translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
      'en-*': 'en',
      'zh-*': 'zh',
      'cn-*': 'zh'
    });

    $translateProvider.preferredLanguage('zh');
    $translateProvider.uniformLanguageTag('bcp47').determinePreferredLanguage();//这个方法是获取手机默认语言设置
    $translateProvider.fallbackLanguage('zh');

    //禁用全局缓存
//    $ionicConfigProvider.views.maxCache(0);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $httpProvider.interceptors.push('UserInterceptor');

    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/loginN.html',
        controller: 'LoginCtrl'
      })

      .state('match', {
        url: '/match',
        templateUrl: 'templates/matchN.html',
        controller: 'MatchCtrl'
      })

      .state('manage', {
        cache: false,
        url: '/manage',
        templateUrl: 'templates/manageN.html',
        controller: 'ManageCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      })

      .state('makeVideo', {
        cache: false,
        url: '/makeVideo',
        templateUrl: 'templates/makeVideoN.html',
        controller: 'makeVideoCtrl',
        params: {'data': null, 'getPremission': null}
      })

      .state('admin', {
        cache: false,
        url: '/admin',
        templateUrl: 'templates/adminN.html',
        controller: 'AdminCtrl'
      })

      // .state('aboutme', {
      //   url: '/aboutme',
      //   templateUrl: 'templates/aboutme.html',
      //   controller: ''
      // })

      .state('clientList', {
        cache: false,
        url: '/clientList',
        templateUrl: 'templates/clientListN.html',
        controller: 'ClientCtrl'
      })

      .state('make', {
        url: '/make',
        templateUrl: 'templates/make.html',
        controller: ''
      })

      .state('choseClient', {
        cache: false,
        url: '/choseClient/:contentid',
        templateUrl: 'templates/choseClientN.html',
        controller: 'ChoseClientCtrl'
      })

      // .state('jmang', {
      //   url: '/jmang',
      //   templateUrl: 'templates/jmang.html',
      //   controller: ''
      // })

      .state('test', {
        url: '/test',
        templateUrl: 'templates/test.html',
        controller: 'ClientCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    // set $cordovaInAppBrowserProvider
    var defaultOptions = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no'
    };

    document.addEventListener("deviceready", function () {
      $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions)
    }, false);

  });

angular.module('starter.controllers', []);
angular.module('starter.services', []);
angular.module('starter.filters', []);
angular.module('starter.directives', []);
