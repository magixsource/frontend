/**
 * Sinobest-Button
 */
(function ($) {
    var defaults = {
        className:"sinobest-button", //CSS类名
        disabled:false,
        value:"",
        onClick:null
    };

    $.fn.sbbutton = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $input = this;
        $input.settings = settings;

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
         * Reload
         * @return object
         */
        $input.reload = function () {
            return render();
        };
        /**
         * show or hide
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
         * Destroy
         */
        $input.destroy = function () {
            return  $input.remove();
        };

        /**
         * Init
         */
        function render() {
            $input.addClass($input.settings.className);

            if ($input.settings.disabled) {
                $input.attr('disabled', 'disabled');
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
         * Get attributes
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