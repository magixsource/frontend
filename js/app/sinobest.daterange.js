(function ($) {
    var defaults = {
        className: "sinobest-daterange", //CSS类名
        required: false, // 是否必录
        readonly: false,
        beginMinDate: null,
        beginMaxDate: null,
        endMinDate: null,
        endMaxDate: null,
        name: "",
        id: "",
        delimiter: null,
        beginSuffix: "_begin",
        endSuffix: "_end",
        callback: null,
        toChar: "\u81f3", // 至
        value: []//数组，有顺序
    };

    $.fn.sbdaterange = function (options) {
        var settings;
        var $daterange = this;
        if (isContain()) {
            if (options) {
                settings = $.extend({}, getter().settings, options || {});
            } else {
                return getter();
            }
        } else {
            settings = $.extend({}, defaults, options || {});
        }

        $daterange.settings = settings;

        function getter() {
            return $daterange.data("$daterange");
        }

        function setter() {
            $daterange.data("$daterange", $daterange);
        }

        function isContain() {
            return $daterange.data("$daterange");
        }

        /**
         * Get value
         */
        $daterange.getValue = function () {
            var values = [$daterange.$begin.getValue(), $daterange.$end.getValue()];
            if ($daterange.settings.delimiter) {
                return values.join($daterange.settings.delimiter);
            } else {
                return values;
            }
        };
        /**
         * Set value
         */
        $daterange.setValue = function (array) {
            if ($.isArray(array)) {
                $daterange.$begin.setValue(array[0]);
                $daterange.$end.setValue(array[1]);
            }
            return $daterange;
        };

        /**
         * DateRange state
         * @return {*}
         */
        $daterange.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set DateRange state
         * @param stateJson
         * @return {*}
         */
        $daterange.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $daterange.setValue(v);
                    } else {
                        if (k == 'required') {
                            $daterange.settings.required = v;
                        } else if (k == 'readonly') {
                            $daterange.settings.readonly = v;
                        }
                        $daterange.attr(k, v);
                    }
                } else {
                    $daterange.removeAttr(k);
                }
            });
            return $daterange;
        };
        /**
         * DOM object
         */
        $daterange.getDom = function () {
            return $daterange[0];
        };
        /**
         * Reload
         */
        $daterange.reload = function () {
            render();
        };
        /**
         * Show or hide
         * @param b
         */
        $daterange.display = function (b) {
            if (b) {
                $daterange.show();
            } else {
                $daterange.hide();
            }
        };
        /**
         * Remove from memory
         */
        $daterange.destroy = function () {
            $daterange.remove();
        };

        /**
         * Validate
         * @return {*}
         */
        $daterange.validate = function () {
            var msgs = [$daterange.$begin.validate(), $daterange.$end.validate()];
            if ($daterange.settings.delimiter) {
                return msgs.join($daterange.settings.delimiter);
            } else {
                return msgs;
            }
        };

        /**
         * Build input element
         */
        function buildInput() {
            var beginName = $daterange.settings.name + $daterange.settings.beginSuffix;
            var endName = $daterange.settings.name + $daterange.settings.endSuffix;
            var beginId;
            var endId;
            if ($daterange.settings.id) {
                beginId = $daterange.settings.id + $daterange.settings.beginSuffix;
                endId = $daterange.settings.id + $daterange.settings.endSuffix;
            } else {
                beginId = beginName;
                endId = endName;
            }

            var $container = $('<input type="text" name="' + beginName + '" id="' + beginId + '">' + $daterange.settings.toChar + '<input type="text" name="' + endName + '" id="' + endId + '">');
            $daterange.append($container);
        };

        /**
         * Get attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($daterange[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        /**
         * Render function
         */
        function render() {
            $daterange.addClass($daterange.settings.className);
            buildInput();
            var beginId;
            $daterange.find("input").each(function (idx) {
                if (idx == 0) {
                    // 覆盖value
                    var beginSettings = $.extend({}, $daterange.settings, {value: $daterange.settings.value[idx]});

                    if (settings.beginMinDate) {
                        beginSettings = $.extend({}, beginSettings, {minDate: settings.beginMinDate});
                    }
                    if (settings.beginMaxDate) {
                        beginSettings = $.extend({}, beginSettings, {maxDate: settings.beginMaxDate});
                    } else {
                        var endId = $daterange.find("input").eq(1).attr('id');
                        beginSettings = $.extend({}, beginSettings, {maxDate: "#F{$dp.$D(\'" + endId + "\')}"});
                    }
                    $daterange.$begin = $(this).sbdate(beginSettings);
                    beginId = $(this).attr('id');
                } else {
                    var endSettings = $.extend({}, $daterange.settings, {value: $daterange.settings.value[idx]});

                    if (settings.endMinDate) {
                        endSettings = $.extend({}, endSettings, {minDate: settings.endMinDate});
                    } else {
                        endSettings = $.extend({}, endSettings, {minDate: "#F{$dp.$D(\'" + beginId + "\')}"});
                    }
                    if (settings.endMaxDate) {
                        endSettings = $.extend({}, endSettings, {maxDate: settings.endMaxDate});
                    }
                    $daterange.$end = $(this).sbdate(endSettings);
                }
            });

            setter();
        }

        render();
        return this;
    };
})(jQuery);
