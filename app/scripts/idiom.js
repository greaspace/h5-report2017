/**
 * Created by Grea on 2017/3/2.
 */
(function ($) {
  $.fn._show = $.fn.show;
  $.fn.show = function(speed, callback) {
    return this._show(speed, callback).on('ui.shown', stopPropagation).trigger('ui.shown');
  };

  $.fn._hide = $.fn.hide;
  $.fn.hide = function (speed, callback) {
    return this._hide(speed, callback).on('ui.hidden', stopPropagation).trigger('ui.hidden');
  };

  function stopPropagation(e) {
    e.stopPropagation();
  }
})(jQuery);

$(function () {
  var EVENT_ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var loading, home, game, answer, resultPage, currentIdiom;
  var rightAnswers = 0;

  // loading page
  loading = $('#loadingPage');
  loading.show(function () {
    var percent = 0, text;
    var si = setInterval(function () {
      percent+=10;
      if (percent <= 100) {
        text = Math.floor(Math.random() * percent) + '%';
      } else {
        text = '100%';
        clearInterval(si);

        loading.trigger('load-finished');
      }
      $('.ui-loading-percent', loading).text(text);
    }, 100);
  }).addClass('fadeIn');

  // home page
  home = $('#homePage');
  loading.one('load-finished', function () {
    loading.on(EVENT_ANIMATION_END, function(e){
      if(e.originalEvent.animationName !== 'fadeOut') return;
      loading.hide();
      home.show(function () {
        home.addClass('fadeIn');
      });
    }).addClass('fadeOut');
  });

  // game page
  game = $('#gamePage');
  game.find('dd').addClass('animated');

  var $answer = $('.idiom-game-answer'),
    answered = '',
    selected = [];

  var $forms = $answer.find('dd'),
    $words = $('.idiom-game-words dd', game);

  game.on('ui.hidden', function () {
    $forms.empty();
    $words.removeClass('bounce selected').off('click', clickOnWord);
    $answer.removeClass('success');
  }).on('ui.shown', function () {
    answered = '';
    selected = [];

    $words.on('click', clickOnWord);
  });

  $answer.on('answer.answer', function (e, answer) {
    var $this = $(this);

    inputAnswer(answered.length, answer);
    answered += answer;

    if(answered.length == 4) {
      var result = $this.data('answer');
      if(answered == result){
        rightAnswers ++;
        $this.addClass('success');
        go();
      } else {
        $this.addClass('fail');

        var sto = setTimeout(function () {
          var answers = result.split('');
          $forms.empty();
          $this.removeClass('fail').addClass('success');
          $.each(answers, inputAnswer);
          go();

          clearTimeout(sto);
        }, 1000);
      }
    }

    function go() {
      var sto = setTimeout(function(){
        redirect(function(){
          game.hide();
          $('#answerPage .ui-scroll-inner').hide();
          $('#answerPage').show(function(){
            $(currentIdiom.id, this).show();
          });
        }, function(){
          answered = '';
          selected = [];
        });

        clearTimeout(sto);
      }, 1000);
    }

    function inputAnswer(index, answer){
      $($forms.get(index)).empty()
        .append($('<span class="animated fadeIn">').text(answer));
    }
  });

  $answer.on('answer.cancel', function (e, cancel) {
    var $this = $(this),
      answers = answered.split(cancel);
    var index = answered.indexOf(cancel);

    for(var i=answered.indexOf(cancel); i<answered.length; i++){
      selected[i].removeClass('selected bounce');
      $('span', $forms.get(i)).one('animationend', function(){
        $(this).remove();
      }).addClass('fadeOut');
    }

    answered = answers[0];
    selected = selected.slice(0, index);
  });

  function clickOnWord(){
    var $this = $(this);
    if($this.is('.selected')){
      $answer.trigger('answer.cancel', $this.text());
    } else {
      $this.addClass('selected bounce');
      $answer.trigger('answer.answer', $this.text());
      selected.push($this);
    }
  }

  // answer page
  answer = $('#answerPage');
  $('.ui-answer-item').each(function () {
    $(this).addClass(getRandomAnimation());
  });

  // .btn-next
  $('.btn-next').on('click', function () {
    var $this = $(this);
    redirect(function(){
      $this.closest('.ui-page').hide();
      game.show();
    });
  });

  $('[data-idiom]').on('click', function(e){
    var $this = $(this);
    redirect(function(){
      $this.closest('.ui-page').hide();
      resetGameSource($this.data('idiom'), function(){
        game.show();
      });
    });
  });

  function resetGameSource(key, cb) {
    var data = DATA_IDIOM[key];
    currentIdiom = data;
    $('#gameImage').attr('src', data.image);
    $('#gameAnswer').data('answer', key);

    var source = data.input.split('').sort();
    $.each(source, function (i, item) {
      $($words.get(i)).text(item);
    });

    cb && cb();
  }

  function redirect(onClose, onOpen) {
    $('#redirect').show(function () {
      $('.ui-redirect-gate').one(EVENT_ANIMATION_END, function () {
        $(this).removeClass('redirect-animation-close');
        onClose && onClose();
        $(this).one(EVENT_ANIMATION_END, function () {
          onOpen && onOpen();
          $('#redirect').hide();
          $(this).removeClass('redirect-animation-open');
        }).addClass('redirect-animation-open');
      }).addClass('redirect-animation-close');
    });
  }

  function getRandomAnimation(io) {
    var type = ['slide', 'bounce', 'zoom'][Math.floor(Math.random() * 3)];
    var direction = ['Up', 'Left', 'Down', 'Right'][Math.floor(Math.random() * 4)];
    io = io || 'In';
    return type + io + direction;
  }

  // result page
  resultPage = $('#resultPage');
  $('#btnScore').on('click', function(){
    redirect(function(){
      answer.hide();
    }, function(){
      resultPage.show();
    });
  });
  resultPage.on('ui.shown', function () {
    var score = rightAnswers < 4 ? 50
      : rightAnswers < 5 ? 70
      : rightAnswers < 6 ? 85
      : 100;
    $('.score', this).attr("src", "./images/idiom/result/score-"+score+".png");
    $('.award', this).each(function(i){
      if(i > rightAnswers) {
        $(this).hide();
      }
    });
  });
  $('.ui-btn-replay').on('click', function(){
    window.location.reload(true);
  });
  $('.ui-btn-share').on('click', function () {
    $('#share').show();
  });
  $('#share').on('click', function(){
    $(this).hide();
  });


  $('.ui-daiyan').on('ui.shown', function(e){
    var self = this;
    var $desc = $('.desc', this).hide(),
      $photo = $('.photo', this).hide();

    $desc.show()
      .filter(':last').on(EVENT_ANIMATION_END, function(){
        $photo.show().addClass('bounceInDown');
      }).end()
      .filter(':even').addClass('slideInLeft').end()
      .filter(':odd').addClass('slideInRight');
  });

  $('.ui-shigan').on('ui.shown', function(e){
    var self = this;
    var $desc = $('.desc', this).hide(),
        $numb = $('.number', this).hide();
    animate(0);

    function animate(index){
      if(index > 3) return animateDescription(self);

      $($desc.get(index)).show().addClass('bounceInDown');
      $($numb.get(index)).show().addClass('swing');
      setTimeout(function(){
        animate(index + 1);
      }, 300);
    }
  });

  $('.ui-tuixiao').on('ui.shown', function(e){
    var self = this;
    var $desc = $('.desc', this).hide();

    $('.people', this).on(EVENT_ANIMATION_END, function(){
      animate(0);
    }).addClass('zoomIn');

    function animate(index){
      if(index > 3) return animateDescription(self);

      $($desc.get(index)).show().addClass(index>1?'bounceInUp':'bounceInDown');
      setTimeout(function(){
        animate(index + 1);
      }, 300);
    }
  });

  $('.ui-feiren').on('ui.shown', function(e){
    var self = this;
    var $time = $('.time', this).hide(),
        $desc = $('.desc', this).hide();
    animate(0);

    function animate(index) {
      if(index > 3) return animateDescription(self);

      $($time.get(index)).show().addClass(!index&1? 'bounceInLeft' : 'bounceInRight');
      $($desc.get(index)).show().addClass(!index&1? 'bounceInLeft' : 'bounceInRight');

      setTimeout(function(){
        animate(index + 1);
      }, 300);
    }
  });

  $('.ui-daoshi').on('ui.shown', function(e){
    var self = this;
    var $desc = $('.desc', this).hide();

    $('.decoration', this).on(EVENT_ANIMATION_END, function(){
      animate(0);
    }).addClass('zoomInUp');

    function animate(index) {
      if(index > 3) return animateDescription(self);

      $($desc.get(index)).show().addClass('fadeInUp');

      setTimeout(function(){
        animate(index + 1);
      }, 300);
    }
  });

  function animateDescription(scope){
    var $text = $('.ui-answer-desc b', scope);
    $text.addClass('animated swing');
  }
});
