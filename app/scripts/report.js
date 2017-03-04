$(function () {
  var EVENT_ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

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
  $homeNavigation.delegate('li', 'click', function (e) {
    var $this = $(this), index = $this.data('index');
    changeDetailContent(index);
    $homePage.hide();
    $asideNavigation.find('li')
      .removeClass('active')
      .filter('[data-index='+index+']')
      .addClass('active');
    $detailPage.show(function(){
      // $('.ui-hd', this).addClass('slideInDown');
      // $('.ui-bd', this).addClass('zoomIn');
    });

  });
  $homePage.one('shown', function () {
    !$('li', $homeNavigation).length && $.each(DATA_REPORT_2017.navs, function (i, item) {
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
  });

  // article page
  var $detailPage = $('#detailPage'),
    $detailAside = $('#detailAside'),
    $asideToggle = $('.ui-aside-toggle', $detailPage),
    $detailBody = $('.ui-bd', $detailPage);

  // aside toggle
  $asideToggle.on('click', function (e) {
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
  $asideNavigation.delegate('li', 'click', function () {
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
  $content.delegate('.ct-collapse-toggle', 'click', function (e) {
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

    new IScroll($scroll[0]);
  }

});