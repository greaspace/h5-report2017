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
      // +++ scroll bar

      contentScroller = new IScroll($scroll[0], {
        tap: true
      });
    });

    $asideNavigation.find('li')
      .removeClass('active')
      .filter('[data-index='+index+']')
      .addClass('active');
  });

  // 初始化首页
  $homePage.one('shown', function () {
    if($('li', $homeNavigation).length) return;
    $.each(DATA_REPORT_2017.items, function (i, item) {
      $('<li>').attr('data-index', i)
        .append($('<b>').text(item.title))
        .appendTo($asideNavigation)
        .clone()
        .addClass('animated')
        .addClass(i&1 ? 'slideInRight':'slideInLeft')
        .append($('<span>').text(item.subtitle))
        .appendTo($homeNavigation);
    });
    new IScroll('.ui-navs-wrapper', { tap: true, scrollbars: true });
  });

  // detail page
  var $detailPage = $('#detailPage'),
    $detailAside = $('#detailAside'),
    $asideToggle = $('.ui-aside-toggle', $detailPage),
    $detailBody = $('.ui-bd', $detailPage);

  // aside toggle
  $asideToggle.on('touchstart', function (e) {
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
  $asideNavigation.delegate('li', 'touchstart', function () {
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
  var $abstract = $('#detailAbscract', $detailPage);
  var $abstractInner = $abstract.find('.ui-abstract-inner');

  var $content = $('.ui-content', $detailPage);

  // 展开/折叠内容
  $content.delegate('.ct-collapse-toggle', EVENT_SINGLE_TOUCH, function (e) {
    e.preventDefault();
    $(this).parent('.ct-section').toggleClass('off');
    contentScroller.refresh();
  });

  var $player = $('#uiPlayer');
  $('#uiPlayer').delegate('img', 'touchstart', playVideo);
  $('#uiPlayer').delegate('video', 'touchstart', playVideo);
  $('.ui-video-play').on('touchstart', playVideo);
  function playVideo(){
    $('.ui-video-play').hide();
    $player.jPlayer('play');
  }

  var $scroll = $('#uiContentScroll'), contentScroller;
  function changeDetailContent(index) {
    var data = DATA_REPORT_2017.items[index];
    if(!data) return;

    // set title
    $title.text(data.title);

    // reset media
    $player.jPlayer('destroy');
    $player.jPlayer({
      ready: onPlayerReady,
      supplied: 'm4v',
      size: {
        width: '100%',
        height: '100%',
        cssClass: 'ui-video-player'
      }
    });

    function onPlayerReady() {
      var $this = $(this);
      $this.jPlayer('setMedia', {
        m4v: data.video.src,
        poster: data.video.poster
      });
    }

    // reset abstract
    $abstractInner.empty();
    $.each(data.abstracts, function (i, item) {
      var section = $('<section>').addClass('ct-section');
      $('<h3>').addClass('ct-title').text(item.h).appendTo(section);
      $.each(item.p, function (i, p) {
        $('<p>').html(p).appendTo(section);
      });
      section.appendTo($abstractInner);
    });

    // reset content
    $content.empty();
    $.each(data.content, function(i, item){
      var section = $('<section>').addClass('ct-section off'), box;
      $('<h3>').addClass('ct-title').text(item.h).appendTo(section);
      box = $('<div>').addClass('ct-collapse').appendTo(section);
      $('<div>').addClass('ct-collapse-toggle').appendTo(section);

      $.each(item.p, function (i, p) {
        $('<p>').html(p).appendTo(box);
      });
      section.appendTo($content);
    });
    // contentScroller && contentScroller.refresh();
  }

  // back && share
  $('.btn-back').on('touchstart', function () {
    $detailPage.addClass('zoomOut');
    $homePage.show(function () {
      $detailPage.hide().removeClass('zoomOut');
    }).addClass('fadeIn');
  });

  $('.btn-share').on('touchstart', function(){
    $('.ui-wechat').show();
  });

  $('.ui-wechat').on('touchstart', function(){
    $(this).hide();
  });
});
