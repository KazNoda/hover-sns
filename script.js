$(function() {

    // Class Destination
    (function(MAIN) {
        "use strict";

        window.MAIN = MAIN;

        MAIN.social = function() {
            this.init.apply(this, arguments);
        };

        MAIN.social.prototype = {
            init : function() {

            },

            /**
             * Facebookの反応（いいねとシェアの数）を取得
             * @param  {string} url
             * @param  {object} $target
             */
            getSocialCountFacebook : function(url, $target) {
                return $.ajax({
                    url:'https://graph.facebook.com/',
                    dataType:'jsonp',
                    data:{
                        id:url
                    },
                    success:function(res){
                        var count = res.shares || 0;
                        $target.html(count);
                    },
                    error:function(){
                        $target.html('?');
                    }
                });
            },

            /**
             * Twitterの反応（ツイートやリツイート数）を取得
             * @param  {string} url
             * @param  {object} $target
             */
            getSocialCountTwitter : function(url, $target) {
                return $.ajax({
                    url:'http://urls.api.twitter.com/1/urls/count.json',
                    dataType:'jsonp',
                    data:{
                        url:url
                    },
                    success:function(res){
                        var count = res.count || 0;
                        $target.html(count);
                    },
                    error:function(){
                        $target.html('?');
                    }
                });
            },

            /**
             * Pinterestのピン数を取得
             * @param  {string} url
             * @param  {object} $target
             */
            getSocialCountPinterest : function(url, $target) {
                return $.ajax({
                    url: 'http://api.pinterest.com/v1/urls/count.json',
                    dataType: 'jsonp',
                    data:{
                        url: url
                    },
                    success: function(res){
                        var count = res.count || 0;
                        $target.html(count);
                    },
                    error: function(){
                        $target.html('?');
                    }
                });
            },

            /**
             * Total Count has more that 0.
             * @param  {[type]}
             * @param  {[type]}
             * @param  {[type]}
             * @return {Boolean}
             */
            hasSocialCount : function(_setting, doneCallback, failCallback) {

                var settings = {
                    url : "",
                    $facebook  : "",
                    $twitter   : "",
                    $pinterest : ""
                };

                $.extend(settings, _setting);

                $.when(
                    this.getSocialCountFacebook(settings.url, settings.$facebook),
                    //this.getSocialCountTwitter(settings.url, settings.$twitter),
                    this.getSocialCountPinterest(settings.url, settings.$pinterest)
                ).done(function(resultFb, resultPn) {

                    // 合計値
                    var totalCount = (resultFb.shares || 0) + (resultPn || 0);

                    // 合計値が１つ以上あれば、成功
                    if (0 < totalCount) {
                        doneCallback(totalCount);
                    } else {
                        failCallback(totalCount);
                    }

                }).fail(function(){
                    failCallback(false);
                });
            }
        };

    })(window.MAIN || {});

    var social = new MAIN.social();

    // カテゴリページでSNSの設定を行う。
    $(".article-permalink").each(function() {

        var $link      = $(this);
        var $facebook  = $(".sns-facebook-counter", $link);
        var $twitter   = $(".sns-twitter-counter", $link);
        var $pinterest = $(".sns-pinterest-counter", $link);

        var url = $link.attr("href");

        social.hasSocialCount({
            "url": url,
            "$facebook" : $facebook,
            "$twitter"  : $twitter,
            "$pinterest": $pinterest
        }, function(count) {
            //合計の数が１以上ある場合に表示
            $(".mask_sns", $link).show();
        }, function(count) {
            //合計の数が０の場合は非表示
            //console.log("total : 0");
            //$(".mask_sns", $link).hide();
        });
    });
});