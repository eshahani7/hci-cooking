var moveLeft = 0;
var moveDown = 0;
console.log("Started..");
$(document).ready(function(){
  $("li").hover(function(){

      // document.getElementById("main").appendChild(ingredientsPopUp);
      $(this).css("background-color", yellow);
      // var target = '#' + ($(this).attr('data-popbox'));
      // $(target).show();
      // moveLeft = $(this).outerWidth();
      // moveDown = ($(target).outerHeight() / 2);
  }, function () {
      console.log("HELLO");
      // var target = '#' + ($(this).attr('data-popbox'));
      // if (!($("a.popper").hasClass("show"))) {
      //     $(target).hide();
      // }
  });

  $('li').mousemove(function (e) {
    console.log("Help pls");
  });
});

// $('a.popper').mousemove(function (e) {
//     // var target = '#' + ($(this).attr('data-popbox'));
//     //
//     // leftD = e.pageX + parseInt(moveLeft);
//     // maxRight = leftD + $(target).outerWidth();
//     // windowLeft = $(window).width() - 40;
//     // windowRight = 0;
//     // maxLeft = e.pageX - (parseInt(moveLeft) + $(target).outerWidth() + 20);
//     //
//     // if (maxRight > windowLeft && maxLeft > windowRight) {
//     //     leftD = maxLeft;
//     // }
//     //
//     // topD = e.pageY - parseInt(moveDown);
//     // maxBottom = parseInt(e.pageY + parseInt(moveDown) + 20);
//     // windowBottom = parseInt(parseInt($(document).scrollTop()) + parseInt($(window).height()));
//     // maxTop = topD;
//     // windowTop = parseInt($(document).scrollTop());
//     // if (maxBottom > windowBottom) {
//     //     topD = windowBottom - $(target).outerHeight() - 20;
//     // } else if (maxTop < windowTop) {
//     //     topD = windowTop + 20;
//     // }
//     //
//     // $(target).css('top', topD).css('left', leftD);
// });
// $('a.popper').click(function (e) {
//     // var target = '#' + ($(this).attr('data-popbox'));
//     // if (!($(this).hasClass("show"))) {
//     //     $(target).show();
//     // }
//     // $(this).toggleClass("show");
// });
