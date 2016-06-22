// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.directives'])

  .run(function ($ImageCacheFactory, $ionicPlatform, $location, $ionicPopup, $rootScope, $state, $stateParams, $ionicHistory, locals) {

    //主页面显示退出提示框  
    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '退出应用?',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
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

//      if (fromState.name == "" && ($rootScope.user && $rootScope.user.token)) {
//
//        event.preventDefault(); // 取消默认跳转行为
//        fromState.name = $rootScope.defaultPage;
//        $state.go($rootScope.defaultPage);
//        return;
//      }
//
//      if (fromState.name == "")
//        return;
//      // 如果用户不存在
//      if (!$rootScope.user || !$rootScope.user.token) {
//
//        if (fromState.name != "login")
//
//        {
//          event.preventDefault(); // 取消默认跳转行为
//          fromState.name = "login";
//          $state.go("login", {from: "login", w: 'notLogin'}); //跳转到登录界面
//        }
//
//      } else {
//        if (toState.url == '/login') {
//          if (fromState.name != "") {
//            event.preventDefault(); // 取消默认跳转行为
//          }
//
//
//        } // 如果是进入登录界面则允许
//      }

      if ($rootScope.user.token) {
        if (fromState.url == "^" && toState.url != "/main") {
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

  .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
        templateUrl: 'templates/managen.html',
        controller: 'MainCtrl'
      })

      .state('match', {
        url: '/match',
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl'
      })

      .state('manage', {
        cache: false,
        url: '/manage',
        templateUrl: 'templates/manage.html',
        controller: 'ManageCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'templates/managen.html',//matchn
        controller: 'MainCtrl'
      })

      .state('makeVideo', {
//        cache: false,
        url: '/makeVideo',
        templateUrl: 'templates/jmlist.html',
        controller: 'makeVideoCtrl',
        params: {'data': null}
      })

      .state('admin', {
//        cache: false,
        url: '/admin',
        templateUrl: 'templates/admin.html',
        controller: 'AdminCtrl'
      })

      .state('aboutme', {
        url: '/aboutme',
        templateUrl: 'templates/aboutme.html',
        controller: ''
      })

      .state('sendV', {
        url: '/sendV',
        templateUrl: 'templates/sendV.html',
        controller: ''
      })

      .state('clientList', {
//        cache: false,
        url: '/clientList',
        templateUrl: 'templates/clientList.html',
        controller: 'ClientCtrl'
      })

      .state('make', {
        url: '/make',
        templateUrl: 'templates/make.html',
        controller: ''
      })

      .state('choseClient', {
        url: '/choseClient/:contentid',
        templateUrl: 'templates/choseClient.html',
        controller: 'ChoseClientCtrl'
      })

      .state('jmang', {
        url: '/jmang',
        templateUrl: 'templates/jmang.html',
        controller: ''
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })
  .factory('UserInterceptor', ["$q", "$rootScope", function ($q, $rootScope) {
      return {
        request: function (config) {
          //config.headers["TOKEN"] = $rootScope.user.token;
          return config;
        },
        responseError: function (response) {
          //            var data = response.data;
          //			// 判断错误码，如果是未登录
          //            if(data["errorCode"] == "500999"){
          //				// 清空用户本地token存储的信息，如果
          //                $rootScope.user = {token:""};
          //				// 全局事件，方便其他view获取该事件，并给以相应的提示或处理
          //                $rootScope.$emit("userIntercepted","notLogin",response);
          //            }
          //			// 如果是登录超时
          //			if(data["errorCode"] == "500998"){
          //                $rootScope.$emit("userIntercepted","sessionOut",response);
          //            }
          return $q.reject(response);
        }
      };
    }])
  .factory('locals', ['$window', function ($window) {
      return {
        //存储单个属性
        set: function (key, value) {
          $window.localStorage[key] = value;
        },
        //读取单个属性
        get: function (key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        //存储对象，以JSON格式存储
        setObject: function (key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }

      }
    }]);
