var intervalID;
$(".code").hover(function(){
    console.log($(".code"));
    console.log(document.querySelectorAll('.code'));
    console.log('ok');
    var $this = $(this);
    console.log($this);
    intervalID = setInterval(function() {
       scroll($this);
    }, 50);
}, function() {
    clearInterval(intervalID);
});

function scroll(ele){
    ele.text(function(i,val) { return val.substr(1) + val.substr(0,1); });
}