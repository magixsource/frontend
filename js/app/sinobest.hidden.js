/**
 * Sinobest-Hidden
 */
(function ($) {
    var defaults = {
        className: "sinobest-hidden", //CSS类名
        value: ""
    };

    $.fn.sbhidden = function (options) {
        var $input = this;
        var settings;
        if (isContain()) {
            if (options) {
                settings = $.extend({}, getter().settings, options || {});
            } else {
                return getter();
            }
        } else {
            settings = $.extend({}, defaults, options || {});
        }
        $input.settings = settings;

        function getter() {
            return $input.data("$input");
        }

        function setter() {
            $input.data("$input", $input);
        }

        /**
         * Get value
         * @return  object
         */
        $input.getValue = function () {
            return $input.val();
        };

        /**
         * Set value
         * @param value new value
         * @return object
         */
        $input.setValue = function (value) {
            return $input.val(value);
        };
        /**
         * Get state
         * @return object
         */
        $input.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set new state
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
         * Reload hidden
         * @return object
         */
        $input.reload = function () {
            return render();
        };

        /**
         * Destroy
         */
        $input.destroy = function () {
            return $input.remove();
        };

        /**
         * Init
         */
        function render() {
            $input.addClass($input.settings.className);

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
        function isContain() {
            return $input.data("$input");
        }

        /**
         * Get hidden attributes
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

        /**
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);