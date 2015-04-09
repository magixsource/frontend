(function ($) {
    var defaults = {
        className:"sinobest-daterange", //CSS类名
        required:false, // 是否必录
        readonly:false,
        beginMinDate:null,
        beginMaxDate:null,
        endMinDate:null,
        endMaxDate:null,
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
            $daterange.remove();
        };

        function render() {
            var beginId;
            $daterange.each(function (idx) {
                if (idx == 0) {
                    var beginSettings = settings;

                    if (settings.beginMinDate) {
                        beginSettings = $.extend({}, beginSettings, {minDate:settings.beginMinDate});
                    }
                    if (settings.beginMaxDate) {
                        beginSettings = $.extend({}, beginSettings, {maxDate:settings.beginMaxDate});
                    }
                    $(this).sbdate(beginSettings);
                    beginId = $(this).attr('id');
                } else {
                    var endSettings = settings;
                    if (settings.endMinDate) {
                        endSettings = $.extend({}, endSettings, {minDate:settings.endMinDate});
                    } else {
                        endSettings = $.extend({}, endSettings, {minDate:"#F{$dp.$D(\'" + beginId + "\')}"});
                    }
                    if (settings.endMaxDate) {
                        endSettings = $.extend({}, endSettings, {maxDate:settings.endMaxDate});
                    }
                    $(this).sbdate(endSettings);
                }
            });
        }

        //return this.each(function () {
        render();
        //});
        return this;
    };
})(jQuery);
