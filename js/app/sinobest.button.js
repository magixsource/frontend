/**
 * Sinobest-Button 控件
 */
(function ($) {
    var defaults = {
        className:"sinobest-button", //CSS类名
        readonly:false,
        value:"",
        onClick:null
    };

    $.fn.sbbutton = function (options) {
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
            return $.extend({}, getAttributes(), getSettings());
        };

        /**
         * Set text new state
         * @param stateJson state json
         * @return  object
         */
        $input.setState = function (stateJson) {
            // 这里的State除了DOM属性之外，其他的部分较为模糊，具体指明不清晰，无法设置
            $.each(stateJson, function (k, v) {
                $input.attr(k, v);
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
         * Destory
         */
        $input.destory = function () {
            return  $input.remove();
        };

        /**
         * Init
         */
        function render() {
            $input.addClass($input.settings.className);

            if ($input.settings.readonly) {
                $input.attr('readonly', 'readonly');
            }
            if ($input.settings.value) {
                $input.val($input.settings.value);
            }
            if ($input.settings.onClick) {
                $input.on("click", $input.settings.onClick);
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