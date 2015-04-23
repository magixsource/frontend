(function ($) {
    $.extend({sberror:{ }});
    $.extend($.sberror, {
        onError:function (e) {
            //console.log(e.code+":::::"+ e.msg);
        },
        format:function (status, url) {
            var msg = "";
            switch (status) {
                case 400:
                    msg = this.ERROR_MSG_400.format(url);
                    break;
                case 404:
                    msg = this.ERROR_MSG_404.format(url);
                    break;
                default:
                    msg = this.ERROR_MSG_UNDEFINED.format(url);
            }
            return msg;
        },
        ERROR_MSG_400:"错误的请求地址{0}",
        ERROR_MSG_404:"数据不存在{0}",
        ERROR_MSG_UNDEFINED:"不明原因请求异常{0}"
    });
})(jQuery);