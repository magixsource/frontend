(function ($) {
    var defaults = {
        className:"sinobest-date", //CSS类名
        required:false, // 是否必录
        readonly:false,
        value:""
    };

    $.fn.sbdate = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $date = this;
        $date.settings = settings;

        $date.getValue = function () {
        };
        $date.setValue = function () {
        };
        $date.getState = function () {
        };
        $date.setState = function () {
        };
        $date.getDom = function () {
        };
        $date.reload = function () {
        };
        $date.display = function () {
        };
        $date.destory = function () {
        };

        function render() {

        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);