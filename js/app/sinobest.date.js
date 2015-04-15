(function ($) {
    var defaults = {
        className:"sinobest-date", //CSS类名
        required:false, // 是否必录
        readonly:false,
        skin:'whyGreen',
        isShowWeek:false,
        isShowClear:true,
        firstDayOfWeek:1,
        dateFormat:"yyyy-MM-dd",
        minDate:null,
        maxDate:null,
        onpicked:null,
        onpicking:null,
        onclearing:null,
        oncleared:null,
        value:""
    };

    $.fn.sbdate = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $date = this;
        $date.settings = settings;

        $date.getValue = function () {
            return $date.val();
        };
        $date.setValue = function (v) {
            return  $date.val(v);
        };
        $date.getState = function () {
            return $.extend({}, getAttributes());
        };
        $date.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                $date.attr(k, v);
            });
            return $date;
        };
        $date.getDom = function () {
            return $date[0];
        };
        $date.reload = function () {
            render();
        };
        $date.display = function (b) {
            if (b) {
                $date.show();
            } else {
                $date.hide();
            }
        };
        $date.destory = function () {
            $date.remove();
        };

        function render() {
            $date.addClass(settings.className).addClass('Wdate');
            if (settings.readonly) {
                $date.attr('readonly', settings.readonly);
            }
            if (settings.required) {
                $date.attr('required', settings.required);
            }
            if (settings.value) {
                $date.val(settings.value);
            }
            $date.on('click', function () {
                var initJson = {
                    skin:settings.skin,
                    firstDayOfWeek:settings.firstDayOfWeek,
                    isShowClear:settings.isShowClear,
                    isShowWeek:settings.isShowWeek,
                    dateFmt:settings.dateFormat,
                    onpicked:settings.onpicked,
                    onpicking:settings.onpicking,
                    onclearing:settings.onclearing,
                    oncleared:settings.oncleared
                };
                if (settings.maxDate) {
                    initJson = $.extend({}, initJson, {maxDate:settings.maxDate});
                }
                if (settings.minDate) {
                    initJson = $.extend({}, initJson, {minDate:settings.minDate});
                }

                WdatePicker(initJson);
            });
        }

        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($date[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);