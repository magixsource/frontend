/**
 * Sinobest-Select 控件
 */
(function ($) {
    var defaults = {
        className:"sinobest-select", //CSS类名
        required:false, // 是否必录
        readonly:false,
        value:"",
        data:null,
        onChange:null
    };

    $.fn.sbselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $select = this;
        $select.settings = settings;

        /**
         * Get value
         * @return  object
         */
        $select.getValue = function () {
            return $select.val();
        };

        /**
         * Set value
         * @param value new value
         * @return object
         */
        $select.setValue = function (value) {
            return $select.val(value);
        };

        /**
         * Get selected text
         * @return {*}
         */
        $select.getDetail = function () {
            return $select.find('option:selected').text();
        };
        /**
         * Get state
         * @return object
         */
        $select.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set new state
         * @param stateJson state json
         * @return  object
         */
        $select.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                $select.attr(k, v);
            });
            return $select;
        };

        /**
         * Get HTML DOM
         * @return DOM object
         */
        $select.getDom = function () {
            return $select[0];
        };

        /**
         * Reload
         * @return object
         */
        $select.reload = function () {
            return render();
        };
        /**
         * Select show or hide
         * @param show show or hide
         * @return object
         */
        $select.display = function (show) {
            if (show) {
                $select.show();
            } else {
                $select.hide();
            }
            return $select;
        };
        /**
         * Destory select
         */
        $select.destory = function () {
            return  $select.remove();
        };

        /**
         * Init
         */
        function render() {
            $select.addClass($select.settings.className);
            if ($select.settings.required) {
                $select.attr('required', $select.settings.required);
            }
            if ($select.settings.readonly) {
                $select.attr('readonly', 'readonly');
            }
            if ($select.settings.value) {
                $select.val($select.settings.value);
            }
            if ($select.settings.onChange) {
                $select.on('change', $select.settings.onChange);
            }
            if ($select.settings.data) {
                // clear all option
                $select.find("option").remove();
                // data reload
                $.each($select.settings.data, function (k, v) {
                    $select.append('<option value="' + v + '">' + k + '</option>');
                });
            }
            return $select;
        }

        /**
         * Get select attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($select[0].attributes, function (i, attr) {
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
            return $select.settings;
        }

        /**
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);