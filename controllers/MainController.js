app.controller("MainController", [
  "$scope",
  "MyService",
  function($scope, MyService) {
    MyService.getData().then(function(data) {
      $scope.tree = data;
      function checkVisibility(data){
        if(data.children.site){
          let site = data.children.site.filter(element => {
            return element.isMatched === true;
          });
          if(site.length > 0){
            data.childrenVisibility = true;
          }else{
            data.childrenVisibility = false;
          }
        }
        if(data.children.organisation.length > 0){
            data.children.organisation.forEach(element => {
              checkVisibility(element);
            });
        }
      }
      
      function matchedAllData(data){
        try{
          if(data.children.site){
            data.children.site.forEach(element => {
              element.isMatched = true;
              element.checked = false;
            });
          }if(data.children.organisation.length> 0){
            data.children.organisation.forEach(element => {
              matchedAllData(element);
            });
          }
          return data;
        }catch(err){
          console.log(err);
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
          console.log(err);
        }
      }
      function openBlock(data){
        try{
        if(data.children.site){
          let matched = data.children.site.filter(element => {
              if(!element.isMatched){
                  element.checked=false;
              }
              return element.isMatched === true;
          });
          if(matched.length > 0){
            data.childrenVisibility = false;
          } else{
            data.childrenVisibility = true;
            data.checked= false;
          }
        }
        if(data.children.organisation.length>0){
          data.children.organisation.forEach( element => {
            openBlock(element);
          });
        }
        return data;
      }catch(err){
        console.log(err);
      }
      }
      search($scope.tree, $scope.searchString);
      openBlock($scope.tree);
      console.log($scope.tree);
    };
    $scope.showContent = true;
    $scope.minimize = function(){
      $scope.showContent = !$scope.showContent;
    };
    $scope.selected ={val:0};
    $scope.$watch('tree',function(){
        function getSelected( data){
         
          try{
            var count = 0;
            if(data.children.site){
              let site = data.children.site.filter(element => {
                return element.checked === true;
              });
              count += site.length;
            } else{
              count += 0;
            }
            if(data.children.organisation.length > 0){
              data.children.organisation.forEach(element => {
               count+= getSelected(element);
              });
            }
            return count;
          }catch(err){
            console.log(err);
          }
        }
        $scope.selected.val = getSelected($scope.tree);
    },true);
  }
]);
