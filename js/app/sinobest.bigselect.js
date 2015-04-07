(function ($) {
    var defaults = {
        className:"sinobest-bigselect", //CSS类名
        required:false, // 是否必录
        readonly:false,
        value:""
    };

    $.fn.sbbigselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $bigselect = this;
        $bigselect.settings = settings;

        $bigselect.getValue = function () {
        };
        $bigselect.setValue = function () {
        };
        $bigselect.getState = function () {
        };
        $bigselect.setState = function () {
        };
        $bigselect.getDom = function () {
        };
        $bigselect.reload = function () {
        };
        $bigselect.display = function () {
        };
        $bigselect.destory = function () {
        };

        function render() {

        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);
