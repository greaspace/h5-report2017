"use strict";var DATA_IDIOM={"工匠精神":{id:".ui-daiyan",input:"工匠精神大刀阔斧万民",image:"./images/idiom/gjjs.png"},"简政放权":{id:".ui-shigan",input:"简政放权因地制宜有矢",image:"./images/idiom/jzfq.png"},"体恤民心":{id:".ui-gongpu",input:"体恤民心所向披靡风云",image:"./images/idiom/txmx.png"},"日理万机":{id:".ui-feiren",input:"日理万机事如意操劳夜",image:"./images/idiom/rlwj.png"},"高瞻远瞩":{id:".ui-tuixiao",input:"高瞻远瞩山流水近闻明",image:"./images/idiom/gzyz.png"},"筚路蓝缕":{id:".ui-daoshi",input:"筚路蓝缕天白云千丝万",image:"./images/idiom/blll.png"}};!function(n){function i(n){n.stopPropagation()}n.fn._show=n.fn.show,n.fn.show=function(n,e){return this._show(n,e).on("ui.shown",i).trigger("ui.shown")},n.fn._hide=n.fn.hide,n.fn.hide=function(n,e){return this._hide(n,e).on("ui.hidden",i).trigger("ui.hidden")}}(jQuery),$(function(){function n(){var n=$(this);n.is(".selected")?f.trigger("answer.cancel",n.text()):(n.addClass("selected bounce"),f.trigger("answer.answer",n.text()),g.push(n))}function i(n,i){var e=DATA_IDIOM[n];r=e,$("#gameImage").attr("src",e.image),$("#gameAnswer").data("answer",n);var t=e.input.split("").sort();$.each(t,function(n,i){$(w.get(n)).text(i)}),i&&i()}function e(n,i){$("#redirect").show(function(){$(".ui-redirect-gate").one(h,function(){$(this).removeClass("redirect-animation-close"),n&&n(),$(this).one(h,function(){i&&i(),$("#redirect").hide(),$(this).removeClass("redirect-animation-open")}).addClass("redirect-animation-open")}).addClass("redirect-animation-close")})}function t(n){var i=["slide","bounce","zoom"][Math.floor(3*Math.random())],e=["Up","Left","Down","Right"][Math.floor(4*Math.random())];return n=n||"In",i+n+e}function a(n){var i=$(".ui-answer-desc b",n);i.addClass("animated rubberBand")}var o,s,d,u,c,r,h="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";o=$("#loadingPage"),o.show(function(){var n,i=0,e=setInterval(function(){i+=10,i<=100?n=Math.floor(Math.random()*i)+"%":(n="100%",clearInterval(e),o.trigger("load-finished")),$(".ui-loading-percent",o).text(n)},100)}).addClass("fadeIn"),s=$("#homePage"),o.one("load-finished",function(){o.on(h,function(n){"fadeOut"===n.originalEvent.animationName&&(o.hide(),s.show(function(){s.addClass("fadeIn")}))}).addClass("fadeOut")}),d=$("#gamePage"),d.find("dd").addClass("animated");var f=$(".idiom-game-answer"),l="",g=[],m=f.find("dd"),w=$(".idiom-game-words dd",d);d.on("ui.hidden",function(){m.empty(),w.removeClass("bounce selected").off("click",n),f.removeClass("success")}).on("ui.shown",function(){l="",g=[],w.on("click",n)}),f.on("answer.answer",function(n,i){function t(){var n=setTimeout(function(){e(function(){d.hide(),$("#answerPage .ui-scroll-inner").hide(),$("#answerPage").show(function(){$(r.id,this).show()})},function(){l="",g=[]}),clearTimeout(n)},1e3)}function a(n,i){$(m.get(n)).empty().append($('<span class="animated fadeIn">').text(i))}var o=$(this);if(a(l.length,i),l+=i,4==l.length){var s=o.data("answer");if(l==s)o.addClass("success"),t();else{o.addClass("fail");var u=setTimeout(function(){var n=s.split("");m.empty(),o.removeClass("fail").addClass("success"),$.each(n,a),t(),clearTimeout(u)},1e3)}}}),f.on("answer.cancel",function(n,i){for(var e=($(this),l.split(i)),t=l.indexOf(i),a=l.indexOf(i);a<l.length;a++)g[a].removeClass("selected bounce"),$("span",m.get(a)).one("animationend",function(){$(this).remove()}).addClass("fadeOut");l=e[0],g=g.slice(0,t)}),u=$("#answerPage"),$(".ui-answer-item").each(function(){$(this).addClass(t())}),$(".btn-next").on("click",function(){var n=$(this);e(function(){n.closest(".ui-page").hide(),d.show()})}),$("[data-idiom]").on("click",function(n){var t=$(this);e(function(){t.closest(".ui-page").hide(),i(t.data("idiom"),function(){d.show()})})}),c=$("#resultPage"),$("#btnScore").on("click",function(){e(function(){u.hide()},function(){c.show()})}),$(".ui-daiyan").on("ui.shown",function(n){var i=$(".desc",this).hide(),e=$(".photo",this).hide();i.show().filter(":last").on(h,function(){e.show().addClass("bounceInDown")}).end().filter(":even").addClass("slideInLeft").end().filter(":odd").addClass("slideInRight")}),$(".ui-shigan").on("ui.shown",function(n){function i(n){return n>3?a(e):($(t.get(n)).show().addClass("bounceInDown"),$(o.get(n)).show().addClass("swing"),void setTimeout(function(){i(n+1)},300))}var e=this,t=$(".desc",this).hide(),o=$(".number",this).hide();i(0)}),$(".ui-feiren").on("ui.shown",function(n){function i(n){return n>3?a(e):($(t.get(n)).show().addClass(1&!n?"bounceInLeft":"bounceInRight"),$(o.get(n)).show().addClass(1&!n?"bounceInLeft":"bounceInRight"),void setTimeout(function(){i(n+1)},300))}var e=this,t=$(".time",this).hide(),o=$(".desc",this).hide();i(0)})});