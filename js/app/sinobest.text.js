/**
 * Sinobest-Text 控件
 */
(function ($) {
    var defaults = {
        className:"sinobest-text", //CSS类名
        required:false, // 是否必录
        minlength:null,
        maxlength:null,
        placeholder:"",
        readonly:false,
        regex:null,
        callback:null,
        value:""
    };

    $.fn.sbtext = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $input = this;
        $input.settings = settings;

        /**
         * Get text value
         * @return  object
         */
        $input.getValue = function () {
            return $input.val();
        };

        /**
         * Set text value
         * @param value new value
         * @return object
         */
        $input.setValue = function (value) {
            return $input.val(value);
        };
        /**
         * Get text state
         * @return object
         */
        $input.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set text new state
         * @param stateJson state json
         * @return  object
         */
        $input.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $input.val(v);
                    } else {
                        $input.attr(k, v);
                    }
                } else {
                    $input.removeAttr(k);
                }
            });
            return $input;
        };

        /**
         * Get HTML DOM
         * @return DOM object
         */
        $input.getDom = function () {
            return $input[0];
        };

        /**
         * Reload text
         * @return object
         */
        $input.reload = function () {
            return render();
        };
        /**
         * Text show or hide
         * @param show show or hide
         * @return object
         */
        $input.display = function (show) {
            if (show) {
                $input.show();
            } else {
                $input.hide();
            }
            return $input;
        };
        /**
         * Destory text
         */
        $input.destory = function () {
            return  $input.remove();
        };

        /**
         * Validate input
         */
        $input.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                // basic validate
                var v = $input.getValue();
                var validator = $.sbvalidate();

                var isOk = false;
                if (settings.required) {
                    isOk = validator.required($input[0], v);
                    if (!isOk) {
                        return "不能为空";
                    }
                }
                if (settings.minlength) {
                    isOk = validator.minlength($input[0], v, settings.minlength);
                    if (!isOk) {
                        return "长度不能小于" + settings.minlength;
                    }
                }
                if (settings.maxlength) {
                    isOk = validator.maxlength($input[0], v, settings.maxlength);
                    if (!isOk) {
                        return "长度不能大于" + settings.maxlength;
                    }
                }
                if (settings.regex) {
                    isOk = validator.valid(settings.regex, v);
                    if (!isOk) {
                        return "格式不正确";
                    }
                }
                return ""; //验证通过
            }
        };


        /**
         * Init
         */
        function render() {
            $input.addClass($input.settings.className);
            if ($input.settings.required) {
                $input.attr('required', $input.settings.required);
            }
            if ($input.settings.placeholder) {
                $input.attr('placeholder', $input.settings.placeholder);
                // 测试是否支持
                if (!isPlaceHolderSupported()) {
                    $input.placeholder();
                }
            }
            if ($input.settings.readonly) {
                $input.attr('readonly', 'readonly');
            }
            if ($input.settings.value) {
                $input.val($input.settings.value);
            }
            return $input;
        }

        /**
         * Get input attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($input[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        function isPlaceHolderSupported() {
            return ('placeholder' in document.createElement('input'));
        }

        /**
         * Get runtime settings
         */
        function getSettings() {
            return $input.settings;
        }

        /**
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);