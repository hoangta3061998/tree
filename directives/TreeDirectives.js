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
          return (
            pagesShown < $scope.tree.children.organisation.length / pageSize
          );
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
      /*
            here we are checking that if current node has children then compiling/rendering children.
            */

      if (
        scope.node &&
        scope.node.children.site &&
        scope.node.children.site.length > 0
      ) {
        /* scope.node.childrenVisibility = true; */

        let childNode = $compile(
          '<ul class="tree" ng-if="!node.childrenVisibility"><site-tree children="node"></site-tree></ul>'
        )(scope);
        element.append(childNode);
      }
      if (scope.node && scope.node.children.organisation.length > 0) {
        /* scope.node.childrenVisibility = true; */

        let childNode = $compile(
          '<ul class="tree" ng-if="!node.childrenVisibility"><organisation-tree children="node"></organisation-tree></ul>'
        )(scope);
        element.append(childNode);
      }
    },
    controller: [
      "$scope",
      function($scope) {
        /*This function is for just toggle the visibility of children */
        $scope.toggleVisibility = function(node) {
          if (node.children) {
            node.childrenVisibility = !node.childrenVisibility;
          }
        };
        //Here we are marking check/un-check all the nodes.

        $scope.checkNode = function(node) {
          node.checked = !node.checked;
          function checkChildren(c) {
            if (c.children.site) {
              angular.forEach(c.children.site, function(c) {
                if (c.isMatched) {
                  c.checked = $scope.node.checked;
                  /* console.log('IM TROUBLE'); */
                } else {
                  c.checked = false;
                  /* console.log('IM TROUBLE 2'); */

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
              console.log(err);
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
            
           function checkParent(){
            try {
              let parent = $scope.$parent.tree;

              let site;
              if (
                parent.children.site &&
                parent.children.organisation.length === 0
              ) {
                site = parent.children.site.filter(element => {
                  return element.checked === true && element.isMatched === true;
                });
                let matchedSite = parent.children.site.filter(element => {
                  return element.isMatched === true;
                });
                if (
                  site.length === matchedSite.length/*  &&
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
                  return element.checked === true && element.isMatched === true;
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
              console.log(err);
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
    ]
  };
});
app.directive("site", function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "templates/site.html",

    link: function(scope, element) {
      // here we are checking that if current node has children then compiling/rendering children
      
      /* var elm = angular.element(document.querySelectorAll(".code")); */
      var elm =angular.element(document.querySelectorAll('.code'));
      console.log(elm);
      elm.on('mouseenter',function(){
        console.log('ok');
      });
      if (
        scope.node &&
        scope.node.children.site &&
        scope.node.children.site.length > 0
      ) {
        scope.node.childrenVisibility = true;
        let childNode = $compile(
          '<ul class="tree" ng-if="!node.childrenVisibility"><site-tree children="node"></site-tree></ul>'
        )(scope);
        element.append(childNode);
      }
      if (scope.node && scope.node.children.organisation.length > 0) {
        let childNode = $compile(
          '<ul class="tree" ng-if="!node.childrenVisibility"><organisation-tree children="node"></organisation-tree></ul>'
        )(scope);
        element.append(childNode);
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
              console.log(err);
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
                    site.length === matchedSite.length /* &&
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
                console.log(err);
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
