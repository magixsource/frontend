(function ($) {
    var defaults = {
        className:"sinobest-daterange", //CSS类名
        required:false, // 是否必录
        readonly:false,
        value:""
    };

    $.fn.sbdaterange = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $daterange = this;
        $daterange.settings = settings;

        $daterange.getValue = function () {
        };
        $daterange.setValue = function () {
        };
        $daterange.getState = function () {
        };
        $daterange.setState = function () {
        };
        $daterange.getDom = function () {
        };
        $daterange.reload = function () {
        };
        $daterange.display = function () {
        };
        $daterange.destory = function () {
        };

        function render() {

        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);
