/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.services', [])

  .factory('$ImageCacheFactory', ['$q', function ($q) {
      return {
        Cache: function (urls) {
          if (!(urls instanceof Array))
            return $q.reject('Input is not an array');

          var promises = [];

          for (var i = 0; i < urls.length; i++) {
            var deferred = $q.defer();
            var img = new Image();

            img.onload = (function (deferred) {
              return function () {
                deferred.resolve();
              }
            })(deferred);

            img.onerror = (function (deferred, url) {
              return function () {
                deferred.reject(url);
              }
            })(deferred, urls[i]);

            promises.push(deferred.promise);
            img.src = urls[i];
          }

          return $q.all(promises);
        }
      }
    }])

  .service('aJaxService', function ($http, $q, $rootScope, $state, locals) {
    var _baseUrl = "http://www.zettaly.com.cn/billboard_app/ajax.php";

    var _token;

    //http Get 请求
    this.httpGetData = function (url) {
      var requestUrl = _baseUrl + url;
      console.log("requestUrl = " + requestUrl);

      var deferred = $q.defer();
      var promise = deferred.promise;

      promise.success = function (fn) {

        promise.then(fn);
        return promise;
      };

      promise.error = function (fn) {
        promise.then(null, fn);
        return promise;
      };


      $http({
        url: requestUrl,
        method: 'GET'
      }).success(function (data) {

        console.log("httpGetData successData = " + JSON.stringify(data));
        if (data.result == 0)
        {
          deferred.resolve(data);
        }
        if (data.result == -2 || data.result == -3 || data.result == -4)
        {
          $rootScope.user = {};
          locals.setObject("user", $rootScope.user);
          $state.go("login");
          deferred.reject(data);
        } else
        {
          deferred.reject(data);
        }


      }).error(function (data) {
        console.log("httpGetData errorData = " + JSON.stringify(data));
        deferred.reject(data);
      });

//      var data = {result: 0, msge: "", msgc: "正确信息", data: {token: "aasadasdq1231afasf1"}};
////      var data = {result: 202, msge: "", msgc: "错误信息", data: null};
//      console.log("httpGetData Data = " + JSON.stringify(data));
//      deferred.resolve(data);

      return promise;
    };

    //http Post 请求
    this.httpPostData = function (url, data) {
      var requestUrl = _baseUrl + url;
      console.log("requestUrl = " + requestUrl);

      var deferred = $q.defer();
      var promise = deferred.promise;

      promise.success = function (fn) {
        promise.then(fn);
        return promise;
      };

      promise.error = function (fn) {
        promise.then(null, fn);
        return promise;
      };

      $http({
        url: requestUrl,
        method: 'POST',
        data: data
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (data) {
        deferred.reject(data);
      });

//      deferred.resolve({result: 0, msge: "parameter mobile length error", msgc: "参数 mobile 长度错误", data: null});
//      deferred.reject({result: 202, msge: "parameter mobile length error", msgc: "参数 mobile 长度错误", data: null});

      return promise;
    };

    this.setToken = function (token) {
      this._token = token;
      $rootScope.user = {};
      $rootScope.user.token = token;
      locals.setObject("user", $rootScope.user);

    };

    this.getToken = function () {
      return $rootScope.user.token;
    };

    this.logout = function () {
      var deferred = $q.defer();
      var promise = deferred.promise;

      $rootScope.user = {};
      locals.setObject("user", $rootScope.user);

      deferred.resolve('Logout Success!');

      promise.success = function (fn) {
        promise.then(fn);
        return promise;
      };
      promise.error = function (fn) {
        promise.then(null, fn);
        return promise;
      };
      return promise;
    };

    this.createProgram = function (programData, callback)
    {
      var items = programData.items;

      var fileMD5s = "";
      var times = "";

      for (var i = 0; i < items.length; i++)
      {
        if (i != 0)
        {
          fileMD5s += ",";
          times += ",";
        }

        fileMD5s += items[i].md5;
        times += items[i].playtime;
      }

      var requestUrl = "?cmd=programAdd&token=" + $rootScope.user.token + "&name=" + programData.name + "&md5s=" + fileMD5s + "&times=" + times;

      this.httpGetData(requestUrl)
        .success(function (data) {
          console.log("Data = " + JSON.stringify(data));
          if (data.result === 0) {
            if (callback)
            {
              callback(data);
            }
          } else {
            if (callback)
            {
              callback(undefined);
            }
          }
        })
        .error(function (data) {

          if (callback)
          {
            callback(undefined);
          }
        });
    };

    this.existFileMD5s = function (files, callback)
    {

      var fileMD5s = "";

      for (var i = 0; i < files.length; i++)
      {
        if (i != 0)
        {
          fileMD5s += ",";
        }


        fileMD5s += files[i].md5;
      }


      var requestUrl = "?cmd=checkImageExist&token=" + $rootScope.user.token + "&md5s=" + fileMD5s;

      this.httpGetData(requestUrl)
        .success(function (data) {
          var info = JSON.stringify(data);
          console.log("Data = " + JSON.stringify(data));
          if (data.result === 0) {
            if (callback)
            {
              callback(data);
            }
          } else {
            if (callback)
            {
              callback(undefined);
            }
          }
        })
        .error(function (data) {

          if (callback)
          {
            callback(undefined);
          }
        });
    };

    this.postImage = function (imageInfo, callback)
    {

      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = imageInfo.filePath;
      options.mimeType = "image/jpeg";
      //用params保存其他参数，例如昵称，年龄之类
      var params = {};
      // params['name'] = imagePath;
      //把params添加到options的params中
      options.params = params;
      //新建FileTransfer对象
      var ft = new FileTransfer();

      var url = _baseUrl + "?cmd=materialAdd&token=" + $rootScope.user.token + "&md5s=" + imageInfo.md5;

      console.log("url is " + url);
      //上传文件
      ft.upload(
        imageInfo.filePath,
        encodeURI(url), //把图片及其他参数发送到这个URL，相当于一个请求，在后台接收图片及其他参数然后处理
        uploadSuccess,
        uploadError,
        options);
      //upload成功的话
      function uploadSuccess(r) {
        var resp = JSON.parse(r.response);

        console.log("upload resulet is" + resp);

        if (resp.result == 0) {

          if (callback)
          {
            callback(resp);
          }

        } else {

          if (callback)
          {
            callback(undefined);
          }
        }
      }
      //upload失败的话
      function uploadError(error) {

        if (callback)
        {
          callback(undefined);
        }
      }
    };


  })

  .service('contentService', function ($q, aJaxService) {

    var _contants = null;

    this.getOnlineContents = function (callback) {

      aJaxService.httpGetData("?cmd=programList&token=" + aJaxService.getToken())
        .success(function (data) {

          if (data.result === 0) {
//            _contants = [
//              {
//                id: "1",
//                first_image: 'img/lightslide/cS-1.jpg',
//                preview_image: 'img/lightslide/thumb/cS-1.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "2",
//                first_image: 'img/lightslide/cS-2.jpg',
//                preview_image: 'img/lightslide/thumb/cS-2.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "3",
//                first_image: 'img/lightslide/cS-3.jpg',
//                preview_image: 'img/lightslide/thumb/cS-3.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "4",
//                first_image: 'img/lightslide/cS-4.jpg',
//                preview_image: 'img/lightslide/thumb/cS-4.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "5",
//                first_image: 'img/lightslide/cS-5.jpg',
//                preview_image: 'img/lightslide/thumb/cS-5.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "6",
//                first_image: 'img/lightslide/cS-6.jpg',
//                preview_image: 'img/lightslide/thumb/cS-6.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "1",
//                first_image: 'img/lightslide/cS-1.jpg',
//                preview_image: 'img/lightslide/thumb/cS-1.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "2",
//                first_image: 'img/lightslide/cS-2.jpg',
//                preview_image: 'img/lightslide/thumb/cS-2.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "3",
//                first_image: 'img/lightslide/cS-3.jpg',
//                preview_image: 'img/lightslide/thumb/cS-3.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "4",
//                first_image: 'img/lightslide/cS-4.jpg',
//                preview_image: 'img/lightslide/thumb/cS-4.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "5",
//                first_image: 'img/lightslide/cS-5.jpg',
//                preview_image: 'img/lightslide/thumb/cS-5.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "6",
//                first_image: 'img/lightslide/cS-6.jpg',
//                preview_image: 'img/lightslide/thumb/cS-6.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "1",
//                first_image: 'img/lightslide/cS-1.jpg',
//                preview_image: 'img/lightslide/thumb/cS-1.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "2",
//                first_image: 'img/lightslide/cS-2.jpg',
//                preview_image: 'img/lightslide/thumb/cS-2.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "3",
//                first_image: 'img/lightslide/cS-3.jpg',
//                preview_image: 'img/lightslide/thumb/cS-3.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "4",
//                first_image: 'img/lightslide/cS-4.jpg',
//                preview_image: 'img/lightslide/thumb/cS-4.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "5",
//                first_image: 'img/lightslide/cS-5.jpg',
//                preview_image: 'img/lightslide/thumb/cS-5.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              },
//              {
//                id: "6",
//                first_image: 'img/lightslide/cS-6.jpg',
//                preview_image: 'img/lightslide/thumb/cS-6.jpg',
//                name: "aaaa",
//                preview_url: "http://123.56.136.253:33380/Webedit/ProjectPreview.aspx?id=4&resolution=1024*768"
//              }
//            ];
            _contants = data.data;
          }
          callback(_contants);

        }).error(function () {
        callback(null);
      });
    };

    this.getContents = function () {
      return this._contants;
    };

    this.publishContents = function (index, ids) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      promise.success = function (fn) {
        promise.then(fn);
        return promise;
      };

      promise.error = function (fn) {
        promise.then(null, fn);
        return promise;
      };

      var requestUrl = "?cmd=programPublish&token=" + aJaxService.getToken() + "&program_id=" + index + "&id=" + ids;
//      var requestUrl = "?cmd=programPublish&token=ac7851a74504be7c4bde5da8c41261ec&program_id=" + index + "&id=" + ids;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          if (data.result === 0) {
            deferred.resolve();
          } else {
            deferred.reject(data.msgc);
          }
        })
        .error(function (data) {
          deferred.reject(data);
        });

      return promise;

    };

    this.removeContents = function (index) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      promise.success = function (fn) {
        promise.then(fn);
        return promise;
      };

      promise.error = function (fn) {
        promise.then(null, fn);
        return promise;
      };

      var requestUrl = "?cmd=programDelete&token=" + aJaxService.getToken() + "&id=" + index;
//      var requestUrl = "?cmd=programDelete&token=ac7851a74504be7c4bde5da8c41261ec&id=" + index;
      aJaxService.httpGetData(requestUrl)
        .success(function (data) {
          if (data.result === 0) {
            deferred.resolve();
          } else {
            deferred.reject(data.msgc);
          }
        })
        .error(function (data) {
          deferred.reject("服务器获取失败");
        });

      return promise;

    };



  });
