app.directive("organisationTree", function() {
  return {
    template:
      '<organisation ng-repeat="node in tree.children.organisation | limitTo: itemsLimit()"></organisation><a ng-show="hasMoreItemsToShow()" ng-click="showMoreItems()" class="loadBtn">...</a> ',
    replace: false,
    restrict: "E",
    scope: {
      tree: "=children"
    },
    controller: [
      "$scope",
      function($scope) {
        var pagesShown = 1;
        var pageSize = 2;
        $scope.itemsLimit = function() {
          return pageSize * pagesShown;
        };
        $scope.hasMoreItemsToShow = function() {
          if($scope.tree){
            if($scope.tree.children){
              if($scope.tree.children.organisation){
                if($scope.tree.children.organisation.length > 0){
                  return  pagesShown < $scope.tree.children.organisation.length / pageSize;
                }
              } else{
                return false;
              }
            } else{
              return false;
            }
          } else{
            return false;
          }
        };
        $scope.showMoreItems = function() {
          pagesShown = pagesShown + 1;
        };
      }
    ]
  };
});
app.directive("organisation", function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/organisation.html",

    link: function(scope, element) {
      if(scope.node.children){
        if(scope.node.children.site){
          let childNode = $compile(
            '<ul class="tree" ng-if="!node.childrenVisibility"><site-tree children="node"></site-tree></ul>'
          )(scope);
          element.append(childNode);
        }
        if(scope.node.children.organisation){
          if(scope.node.children.organisation.length>0){
            let childNode = $compile(
              '<ul class="tree" ng-if="!node.childrenVisibility"><organisation-tree children="node"></organisation-tree></ul>'
            )(scope);
            element.append(childNode);
          }
        }
      }
    },
    controller: [
      "$scope",
      function($scope) {
        $scope.class = $scope.node.class;
        /*This function is for just toggle the visibility of children */
        $scope.toggleVisibility = function(node) {
          if (node.children) {
            node.childrenVisibility = !node.childrenVisibility; 
          }
          if($scope.node.class === "raw"){
            $scope.node.class = "expanded";
          } else{
            $scope.node.class = "raw";
          }
          $scope.class = $scope.node.class;
        };
        //Here we are marking check/un-check all the nodes.
        $scope.$watch('node.childrenVisibility',function(){
          if($scope.node.childrenVisibility){
            $scope.node.class = "raw";
          }else{
            $scope.node.class = "expanded";
          }
          $scope.class = $scope.node.class;
        });
        $scope.checkNode = function(node) {
          node.checked = !node.checked;
          function checkChildren(c) {
            if (c.children.site) {
              angular.forEach(c.children.site, function(c) {
                if (c.isMatched) {
                  c.checked = $scope.node.checked;
                } else {
                  c.checked = false;
                }
              });
            }
            if (c.children.organisation.length > 0) {
              c.children.organisation.forEach(element => {
                element.checked = $scope.node.checked;
                checkChildren(element);
              });
            }
          }

          checkChildren(node);
        };

        $scope.countSite = function(node) {
          function count(item) {
            try {
              var c = 0;
              if (item.children.site && item.children.site.length > 0) {
                let matchedItem = item.children.site.filter(element => {
                  return element.isMatched === true;
                });
                c += matchedItem.length;
              }
              if (item.children.organisation.length > 0) {
                item.children.organisation.forEach(element => {
                  c += count(element);
                });
              }
              return c;
            } catch (err) {
            }
          }

          return count(node);
        };
        $scope.totalSite = $scope.countSite($scope.node);
        $scope.$watch(
          "node",
          function() {
            $scope.totalSite = $scope.countSite($scope.node);
          },
          true
        );
        $scope.$watch(
          "node.checked",
          function() {
            function checkParent() {
              try {
                let parent = $scope.$parent.tree;

                let site;
                if (
                  parent.children.site &&
                  parent.children.organisation.length === 0
                ) {
                  site = parent.children.site.filter(element => {
                    return (
                      element.checked === true && element.isMatched === true
                    );
                  });
                  let matchedSite = parent.children.site.filter(element => {
                    return element.isMatched === true;
                  });
                  if (
                    site.length ===
                    matchedSite.length /*  &&
                  matchedSite.length > 0 */
                  ) {
                    parent.checked = true;
                  } else {
                    parent.checked = false;
                  }
                } else if (
                  parent.children.site &&
                  parent.children.organisation.length > 0
                ) {
                  let siteL = parent.children.site.filter(element => {
                    return (
                      element.checked === true && element.isMatched === true
                    );
                  });
                  let orgL = parent.children.organisation.filter(element => {
                    return element.checked === true;
                  });
                  let matchedSite = parent.children.site.filter(element => {
                    return element.isMatched === true;
                  });
                  if (
                    siteL.length === matchedSite.length &&
                    /*  matchedSite.length > 0 && */
                    orgL.length === parent.children.organisation.length
                  ) {
                    parent.checked = true;
                  } else {
                    parent.checked = false;
                  }
                }
              } catch (err) {
              }
            }
            checkParent();
          },
          true
        );
      }
    ]
  };
});
app.directive("siteTree", function() {
  return {
    template:
      '<site ng-repeat="node in tree.children.site | limitTo: itemsLimit()"></site><a ng-show="hasMoreItemsToShow()" ng-click="showMoreItems()" class="loadBtn">...</a> ',
    replace: false,
    restrict: "E",
    scope: {
      tree: "=children"
    },
    controller: [
      "$scope",
      function($scope) {
        var pagesShown = 1;
        var pageSize = 2;
        $scope.itemsLimit = function() {
          return pageSize * pagesShown;
        };
        $scope.hasMoreItemsToShow = function() {
          return pagesShown < $scope.tree.children.site.length / pageSize;
        };
        $scope.showMoreItems = function() {
          pagesShown = pagesShown + 1;
        };
      }
    ],
    link: function(scope, element) {
     var e = element.find('.code');
    }
  };
});
app.directive("site", function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/site.html",

    link: function(scope, element) {
      // here we are checking that if current node has children then compiling/rendering children
      if(scope.node.children){
        if(scope.node.children.site){
          let childNode = $compile(
            '<ul class="tree" ng-if="!node.childrenVisibility"><site-tree children="node"></site-tree></ul>'
          )(scope);
          element.append(childNode);
        }
        if(scope.node.children.organisation){
          if(scope.node.children.organisation.length>0){
            let childNode = $compile(
              '<ul class="tree" ng-if="!node.childrenVisibility"><organisation-tree children="node"></organisation-tree></ul>'
            )(scope);
            element.append(childNode);
          }
        }
      }
    },
    controller: [
      "$scope",
      function($scope) {
        // This function is for just toggle the visibility of children
        $scope.toggleVisibility = function(node) {
          if (node.children) {
            node.childrenVisibility = !node.childrenVisibility;
          }
        };
        //Here we are marking check/un-check all the nodes.
        $scope.checkNode = function(node) {
          node.checked = !node.checked;
          function checkChildren(c) {
            try {
              if (c.children.site) {
                angular.forEach(c.children.site, function(c) {
                  if (c.isMatched) {
                    c.checked = $scope.node.checked;
                  } else {
                    c.checked = false;
                  }
                });
              }
              if (c.children.organisation.length > 0) {
                c.children.organisation.forEach(element => {
                  checkChildren(element);
                });
              }
            } catch (err) {
            }
          }

          checkChildren($scope.node);
        };
        $scope.$watch(
          "node.checked",
          function() {
            function checkParent() {
              try {
                let parent = $scope.$parent.tree;

                let site;
                if (
                  parent.children.site &&
                  parent.children.organisation.length === 0
                ) {
                  site = parent.children.site.filter(element => {
                    return (
                      element.checked === true && element.isMatched === true
                    );
                  });
                  let matchedSite = parent.children.site.filter(element => {
                    return element.isMatched === true;
                  });
                  if (
                    site.length ===
                    matchedSite.length /* &&
                    matchedSite.length > 0 */
                  ) {
                    parent.checked = true;
                  } else {
                    parent.checked = false;
                  }
                } else if (
                  parent.children.site &&
                  parent.children.organisation.length > 0
                ) {
                  let siteL = parent.children.site.filter(element => {
                    return (
                      element.checked === true && element.isMatched === true
                    );
                  });
                  let orgL = parent.children.organisation.filter(element => {
                    return element.checked === true;
                  });
                  let matchedSite = parent.children.site.filter(element => {
                    return element.isMatched === true;
                  });
                  if (
                    siteL.length === matchedSite.length &&
                    /* matchedSite.length > 0 && */
                    orgL.length === parent.children.organisation.length
                  ) {
                    parent.checked = true;
                  } else {
                    parent.checked = false;
                  }
                }
              } catch (err) {
              }
            }
            checkParent();
          },
          true
        );
      }
    ]
  };
});
