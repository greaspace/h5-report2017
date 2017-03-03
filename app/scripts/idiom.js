/**
 * Created by Grea on 2017/3/2.
 */
(function ($) {
  $.fn._show = $.fn.show;
  $.fn.show = function(speed, callback) {
    return this._show(speed, callback).trigger('ui.shown');
  };

  $.fn._hide = $.fn.hide;
  $.fn.hide = function (speed, callback) {
    return this._hide(speed, callback).trigger('ui.hidden');
  };
})(jQuery);

$(function () {
  var EVENT_ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var loading, home, game, answer;

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

        loading.trigger('load-finished')
      }
      $('.ui-loading-percent', loading).text(text);
    }, 100);
  }).addClass(getRandomAnimation());

  // home page
  home = $('#homePage');
  loading.one('load-finished', function () {
    loading.one(EVENT_ANIMATION_END, function(){
      loading.hide();
    }).addClass(getRandomAnimation('Out'));
    home.show(function () {
      home.addClass(getRandomAnimation());
    });
  });
  $('#play', home).on('click', function () {
    redirect(function(){
      home.hide();
      game.show();
    });
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
        $this.addClass('success');
      } else {
        $this.addClass('fail');

        var sto = setTimeout(function () {
          var answers = result.split('');
          $this.removeClass('fail');
          $.each(answers, inputAnswer);
          $this.addClass('success');

          clearTimeout(sto);
        }, 200);
      }

      redirect(function(){
        game.hide();
        $('#answerPage').show();
      }, function(){
        answered = '';
        selected = [];
      });
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
});
