/**
 * Sinobest-Text
 */
(function ($) {
    var defaults = {
        className:"sinobest-text", //CSS类名
        required:false, // 是否必录
        minlength:null,
        maxlength:null,
        placeholder:"",
        disabled:null,
        readonly:false,
        regex:null,
        callback:null,
        value:""
    };

    $.fn.sbtext = function (options) {
        var $input = this;
        var settings;
        if(isContain()){
            if(options){
                settings = $.extend({},getter().settings,options||{});
            }else{
                return getter();
            }
        }else{
            settings = $.extend({}, defaults, options || {});
        }

        $input.settings = settings;

        function getter(){
           return $input.data("$input");
        }
        function setter(){
            $input.data("$input",$input);
        }

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
                        if (k == 'required') {
                            $input.settings.required = v;
                        } else if (k == 'readonly') {
                            $input.settings.readonly = v;
                        } else if(k == 'disabled'){
                            $input.settings.disabled = v;
                            if(v){
                                toggleDisabledClass(true);
                            }else{
                                toggleDisabledClass(false);
                            }

                        }
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
         * Destroy text
         */
        $input.destroy = function () {
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

                var isOk = false;
                if (settings.required) {
                    isOk = $.sbvalidator.required($input[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }
                if (settings.minlength) {
                    isOk = $.sbvalidator.minlength($input[0], v, settings.minlength);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_MIN_LENGTH + settings.minlength;
                    }
                }
                if (settings.maxlength) {
                    isOk = $.sbvalidator.maxlength($input[0], v, settings.maxlength);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_MAX_LENGTH + settings.maxlength;
                    }
                }
                if (settings.regex) {
                    isOk = $.sbvalidator.valid(settings.regex, v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REGEX;
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
            if ($input.settings.disabled) {
                $input.attr('disabled', 'disabled');
                toggleDisabledClass(true);
            }
            if ($input.settings.value) {
                $input.val($input.settings.value);
            }

            setter();
            return $input;
        }

        /**
         * Check is containe by jquery.data
         * @returns {*}
         */
        function isContain(){
            return $input.data("$input");
        }

        /**
         * enabled or disabled class
         */
        function toggleDisabledClass(flag){
            if(flag){
                $input.addClass('input-disabled');
            }else{
                $input.removeClass('input-disabled');
            }
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
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);