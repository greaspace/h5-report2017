$(function () {
  // loading page
  $('.ui-loading .loading-image-mask').animate({
    height: 0
  }, {
    duration: 2000,
    // easing: 'swing',
    progress: function (animation, progress) {
      progress = parseInt(progress * 100) + '%';
      $('.ui-loading .loading-text').text(progress);
      $('.ui-loading .loading-image-progress-bar').css({
        width: progress
      });
    },
    done: function () {
      $('#loadingPage').addClass('fadeOut');
    }
  });

  // main page
  $('#loadingPage').one('animationend', function () {
    $(this).hide();

    $('#mainPage').show().addClass('fadeIn');
  });

  var navs = $('.ui-index-navs li').addClass('animated');
  navs.filter(':odd').addClass('slideInRight');
  navs.filter(':even').addClass('slideInLeft');

  $('#mainPage').one('animationend', function () {

    var elemBodyWrapper = $('.ui-body-wrapper', this);
    new IScroll(elemBodyWrapper[0]);
    new IScroll('.ui-index-navs-wrapper');
  });

  $('#mainPage .ui-navs li').on('click touchstart', function () {
    $('#articlePage').show().addClass('zoomIn');
    $('#mainPage').hide();
  });

  // article page
  $('.ui-article-page').one('animationend', function () {
    var elemBodyWrapper = $('.ui-body-wrapper', this);
    new IScroll(elemBodyWrapper[0]);
  });

  var width = $('#articlePage .ui-body-wrapper').width();
  $('.ui-sidebar-toggle').on('click touchstart', function (e) {
    e.preventDefault();

    var active = $(this).hasClass('on');
    var $elem = $('#articlePage article');
    var aside = $('#articlePage aside');

    if (active){
      $(this).removeClass('on');

      aside.animate({
        right: -120
      }, function () {
        $(this).hide()
      })
    } else {
      $(this).addClass('on');

      aside.show().animate({
        right: 0
      });
    }

    $(this).animate({textIndent: 0}, {
      progress: function (animation, progress) {
        $(this).css({
          transform: 'rotateZ(' + 360*scale(progress) + 'deg)'
        })
      }
    });

    $elem.animate({textIndent: 0}, {
      progress: function (animation, progress) {
        $elem.css({
          transform: 'scaleX('+ (1-0.4*scale(progress)) +') skewY(' + 14*scale(progress) + 'deg)'
        });
      }
    });

    function scale(progress) {
      return active ? 1-progress : progress;
    }


  });

  $('#articlePage .ui-navs li').on('click touchstart', function () {
    var $elem = $('#articlePage article');
    var aside = $('#articlePage aside');
    $elem.animate({textIndent: 0}, {
      progress: function (animation, progress) {
        $('.ui-sidebar-toggle').removeClass('on');
        aside.animate({
          right: -120
        }, function () {
          $(this).hide()
        });
        $elem.css({
          transform: 'scaleX('+ (0.6-0.6*progress) +') skewY(14deg)'
        });
      },
      done: function () {
        $elem.delay(500).animate({textIndent: 0}, {
          progress: function (animation, progress) {
            $elem.css({
              transform: 'scaleX('+ progress +') skewY(' + 14*(1-progress) +'deg)'
            });
          }
        });
      }
    });
  });

  $('.panel-toggle').on('click touchstart', function (e) {
    e.preventDefault();
    // var $parent = $(this).parent('.panel'),
    //     $p = $('p', $parent);
    $(this).closest('.panel').find('p').toggle();
  });

});
