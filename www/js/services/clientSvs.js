/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.services')

  .service('clientService', function ($q, aJaxService) {

    this.getClients = function (callback) {

//      aJaxService.httpGetData("?cmd=clientList&token=ac7851a74504be7c4bde5da8c41261ec")
      aJaxService.httpGetData("?cmd=clientList&token=" + aJaxService.getToken())
        .success(function (data) {

          if (data.result === 0) {
//            var _contants = [
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
            var _contants = data.data;
            callback(_contants);
          } else {
            callback(null);
          }

        }).error(function () {
        callback(null);
      });
    };

    this.getContents = function () {
      return this._contants;
    };

    this.rename = function (clientID, name) {
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

      var requestUrl = "?cmd=clientRename&token=" + aJaxService.getToken() + "&id=" + clientID + "&name=" + name;
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


  });
