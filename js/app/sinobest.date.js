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
        callback:null, //验证回调函数名
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
                if (v) {
                    if (k == 'value') {
                        $date.val(v);
                    } else {
                        if (k == 'required') {
                            $date.settings.required = v;
                        } else if (k == 'readonly') {
                            $date.settings.readonly = v;
                        }
                        $date.attr(k, v);
                    }
                } else {
                    $date.removeAttr(k);
                }
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
        $date.destroy = function () {
            $date.remove();
        };

        $date.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                var v = $date.getValue();
                var isOk = false;

                if (settings.required) {
                    isOk = $.sbvalidator.required($date[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }
                return ""; //验证通过
            }
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
                $date.setValue(settings.value);
            }
            $date.off('click').on('click', function () {
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
                if (settings.readonly) {
                    initJson = $.extend({}, initJson, {readOnly:settings.readonly});
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