$(function () {
  var EVENT_ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var EVENT_SINGLE_TOUCH = 'tap';

  // loading page
  var $loadingPage = $('#loadingPage');
  $loadingPage
    .on(EVENT_ANIMATION_END, function (e) {
      if(e.target !== this || e.originalEvent.animationName !== 'fadeOut') return;

      $(this).hide();
      $homePage.show(function () {
        $(this).trigger('shown');
      }).addClass('fadeIn');
    })
    .show(function(){
      $('.ui-loading .ui-loading-mask', $loadingPage).animate({
        height: 0
      }, {
        duration: 2000,
        progress: function (animation, progress) {
          progress = parseInt(progress * 100) + '%';
          $('.ui-loading .ui-loading-progress', $loadingPage).text(progress);
        },
        done: function () {
          $loadingPage.addClass('fadeOut');
        }
      });
    })
    .addClass('fadeIn');

  // main page
  var $homePage = $('#homePage');
  var $homeNavigation = $('.ui-navs', $homePage);
  $homeNavigation.delegate('li', EVENT_SINGLE_TOUCH, function (e) {
    var $this = $(this), index = $this.data('index');
    changeDetailContent(index);
    $homePage.hide();
    $detailPage.show(function(){
      new IScroll($scroll[0], { tap: true })
    });

    $asideNavigation.find('li')
      .removeClass('active')
      .filter('[data-index='+index+']')
      .addClass('active');
  });
  $homePage.one('shown', function () {
    if($('li', $homeNavigation).length) return;
    $.each(DATA_REPORT_2017.navs, function (i, item) {
      var nav = item.split(' ');
      $('<li>').attr('data-index', i)
        .append($('<b>').text(nav[0]))
        .appendTo($asideNavigation)
        .clone()
        .addClass('animated')
        .addClass(i&1 ? 'slideInRight':'slideInLeft')
        .append($('<span>').text(nav[1]))
        .appendTo($homeNavigation);
    });
    new IScroll('.ui-navs-wrapper', { tap: true });
  });

  // article page
  var $detailPage = $('#detailPage'),
    $detailAside = $('#detailAside'),
    $asideToggle = $('.ui-aside-toggle', $detailPage),
    $detailBody = $('.ui-bd', $detailPage);

  // aside toggle
  $asideToggle.on(EVENT_SINGLE_TOUCH, function (e) {
    var current = $(this).hasClass('on');
    $asideToggle.toggleClass('on', !current);

    !current && $detailAside.show();
    $detailAside.animate({
      right: current ? -100 : 0
    }, {
      progress: function (animation, progress) {
        $detailBody.css({
          transform: 'scaleX('+ (1-0.4*scale(progress)) +') skewY(' + 14*scale(progress) + 'deg)'
        });
      },
      done: function () {
        current && hideDetailAside();
      }
    });

    function scale(progress) {
      return current ? 1-progress : progress;
    }
  });

  // helper
  function hideDetailAside() {
    $detailAside.hide();
    $asideToggle.removeClass('on');
  }

  // navigation
  var $asideNavigation = $('.ui-menus', $detailPage);
  $asideNavigation.delegate('li', EVENT_SINGLE_TOUCH, function () {
    if($(this).is('.active')) return;

    $(this).addClass('active').siblings().removeClass('active');

    var index = $(this).data('index');
    $detailAside.animate({ right: -100 }, {
      progress: function (animation, progress) {
        $detailBody.css({
          transform: 'scaleX('+ (0.6-0.6*progress) +') skewY(14deg)'
        });
      },
      done: function () {
        hideDetailAside();
        changeDetailContent(index);
        $detailBody.delay(500).animate({textIndent: 0}, {
          progress: function (animation, progress) {
            $detailBody.css({
              transform: 'scaleX('+ progress +') skewY(' + 14*(1-progress) +'deg)'
            });
          }
        });
      }
    });
  });


  var $title = $('.ui-module-title', $detailPage);
  var $content = $('.ui-content', $detailPage);
  $content.delegate('.ct-collapse-toggle', EVENT_SINGLE_TOUCH, function (e) {
    e.preventDefault();
    $(this).parent('.ct-section').toggleClass('off');
  });

  var $scroll = $('#uiContentScroll');
  function changeDetailContent(index) {
    var data = DATA_REPORT_2017.items[index];
    if(!data) return;

    $title.text(data.title);
    $content.empty();

    $.each(data.content, function(i, item){
      var section = $('<section>').addClass('ct-section off'), box;
      $('<h3>').addClass('ct-title').text(item.h).appendTo(section);
      box = $('<div>').addClass('ct-collapse').appendTo(section);
      $('<div>').addClass('ct-collapse-toggle').appendTo(section);

      $.each(item.p, function (i, p) {
        $('<p>').text(p).appendTo(box);
      });
      section.appendTo($content);
    });
  }

});

$(function () {
  $(document).on('WeixinJSBridgeReady', function(){
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
      WeixinJSBridge.invoke('sendAppMessage', {
        'appid': '123',
        'img_url': 'http://bcs.duapp.com/api100/image/logo/lover.jpg',
        'img_width': '160',
        'img_height': '160',
        'link': 'https://greaspace.github.io/h5-report2017/dist/report.html',
        'desc':  '中国网出品',
        'title': '2017政府工作报告 - 中国网'
      }, function (res) {
        _report('send_msg', res.err_msg);
      })
    });
  })
});
