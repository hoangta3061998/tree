app.controller("MainController", [
  "$scope",
  "MyService",
  function($scope, MyService) {
    MyService.getData().then(function(data) {
      $scope.tree = data;
      function checkVisibility(data) {
        if (data.children.site) {
          let site = data.children.site.filter(element => {
            return element.isMatched === true;
          });
          if (site.length > 0) {
            data.childrenVisibility = true;
          } else {
            data.childrenVisibility = false;
          }
        }
        if (data.children.organisation.length > 0) {
          data.children.organisation.forEach(element => {
            checkVisibility(element);
          });
        }
      }

      function matchedAllData(data) {
        try {
          if (data.children.site) {
            data.children.site.forEach(element => {
              element.isMatched = true;
              element.checked = false;
            });
          }
          if (data.children.organisation.length > 0) {
            data.children.organisation.forEach(element => {
              matchedAllData(element);
            });
          }
          return data;
        } catch (err) {
         
        }
      }
      matchedAllData($scope.tree);
      checkVisibility($scope.tree);
    });
    $scope.search = function() {
      function search(item, text) {
        try {
          if (item.children.site) {
            item.children.site.forEach(element => {
              if (element.code.toLowerCase().indexOf(text) !== -1) {
                element.isMatched = true;
              } else if (element.name) {
                if (element.name.toLowerCase().indexOf(text) !== -1) {
                  element.isMatched = true;
                } else {
                  element.isMatched = false;
                }
              } else {
                element.isMatched = false;
              }
            });
          }
          if (item.children.organisation.length > 0) {
            item.children.organisation.forEach(element => {
              search(element, text);
            });
          }
          return item;
        } catch (err) {
          
        }
      }
      function openBlock(data) {
        try {
          if (data.children.site) {
            let matched = data.children.site.filter(element => {
              if (!element.isMatched) {
                element.checked = false;
              }
              return element.isMatched === true;
            });
            if (matched.length > 0) {
              data.childrenVisibility = false;
              data.matched = true;
            } else {
              data.childrenVisibility = true;
              data.checked = false;
              data.matched = false;
            }
          } else {
            data.checked = false;
          }
          if (data.children.organisation.length > 0) {
            data.children.organisation.forEach(element => {
              openBlock(element);
              if(element.matched){
                data.matched = true;
              }
            });
          }
          if(data.matched){
            data.childrenVisibility = false;
          }
          return data;
        } catch (err) {
        }
      }
      search($scope.tree, $scope.searchString);
      openBlock($scope.tree);
    };
    $scope.showContent = true;
    $scope.minimize = function() {
      $scope.showContent = !$scope.showContent;
    };
    $scope.selected = { val: 0 };
    $scope.$watch(
      "tree",
      function() {
        function getSelected(data) {
          try {
            var count = 0;
            if (data.children.site) {
              let site = data.children.site.filter(element => {
                return element.checked === true;
              });
              count += site.length;
            } else {
              count += 0;
            }
            if (data.children.organisation.length > 0) {
              data.children.organisation.forEach(element => {
                count += getSelected(element);
              });
            }
            return count;
          } catch (err) {
            
          }
        }
        $scope.selected.val = getSelected($scope.tree);
        $scope.totalSite = $scope.countSite($scope.tree);
        function treeCheck(tree) {
          try {
            let orgSite;
            orgSite = tree.children.organisation.filter(element => {
              return element.checked === true;
            });
            if (orgSite.length === tree.children.organisation.length) {
              tree.checked = true;
            } else {
              tree.checked = false;
            }
          } catch (err) {
          }
        }
        treeCheck($scope.tree);
      },
      true
    );
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
    $scope.checkAll = function(tree) {
      tree.checked = !tree.checked;
      function checkChildren(c) {
        try {
          if (c.children.site) {
            angular.forEach(c.children.site, function(c) {
              if (c.isMatched) {
                c.checked = tree.checked;
              } else {
                c.checked = false;
              }
            });
          }
          if (c.children.organisation.length > 0) {
            c.children.organisation.forEach(element => {
              element.checked = tree.checked;
              checkChildren(element);
            });
          }
        } catch (err) {
        }
      }
      checkChildren(tree);
    };
  }
]);
