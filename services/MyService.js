app.factory("MyService", [
  "$http",
  function($http) {
    var thisService = {};
    thisService.getData = function() {
      return $http.get("tree.json").then(
        function(response) {
          return response.data;
        },
        function(err) {
          return "Cannot retrieve data!";
        }
      );
    };
    return thisService;
  }
]);
