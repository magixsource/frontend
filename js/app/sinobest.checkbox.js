(function ($) {
    var defaults = {
        className: "sinobest-checkbox", //CSS类名
        required: false, // 是否必录
        disabled: false,
        direction: 'line', //row、table
        columnCount: null,
        delimiter: null, // 分隔符、若为空则返回数组
        name: null,
        valueField: "code",
        labelField: "detail",
        data: null,
        url: null,
        callback: null,
        value: ""
    };

    $.fn.sbcheckbox = function (options) {
        var settings;
        var $checkbox = this;
        if (isContain()) {
            if (options) {
                settings = $.extend({}, getter().settings, options || {});
            } else {
                return getter();
            }
        } else {
            settings = $.extend({}, defaults, options || {});
        }
        $checkbox.settings = settings;

        function getter() {
            return $checkbox.data("$checkbox");
        }

        function setter() {
            $checkbox.data("$checkbox", $checkbox);
        }

        function isContain() {
            return $checkbox.data("$checkbox");
        }

        /**
         * Get checkbox value
         * @return {*}
         */
        $checkbox.getValue = function () {
            var chkValue = [];
            $checkbox.find(":checkbox").filter(':checked').each(function () {
                chkValue.push($(this).val());
            });
            if ($checkbox.settings.delimiter) {
                // 按分隔符
                return chkValue.join($checkbox.settings.delimiter);
            } else {
                return chkValue;
            }
        };

        /**
         * 获取选中项的文字描述
         * @returns {*}
         */
        $checkbox.getDetail = function () {
            var chkDetail = [];
            $checkbox.find(":checkbox").filter(':checked').each(function () {
                chkDetail.push($(this).next("label").text());
            });
            if ($checkbox.settings.delimiter) {
                // 按分隔符
                return chkDetail.join($checkbox.settings.delimiter);
            } else {
                return chkDetail;
            }
        };

        /**
         * Set Checkbox value
         * @param v
         * @return {*}
         */
        $checkbox.setValue = function (v) {
            if (!$checkbox.settings.data) {
                $checkbox.data('$temp', v);
                return $checkbox;
            }
            $checkbox.find(":checkbox").filter(':checked').prop('checked', false);

            if (!$.isArray(v)) {
                v = [v];
            }
            $.each(v, function (idx, value) {
                $checkbox.find(":checkbox").filter('[value=' + value + ']').prop('checked', true);
            });
            return $checkbox;
        };

        /**
         * Get state
         */
        $checkbox.getState = function () {
            return $.extend({}, getAttributes());
        };
        /**
         * Set state
         */
        $checkbox.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $checkbox.setValue(v);
                    } else {
                        if (k == 'required') {
                            $checkbox.settings.required = v;
                        } else if (k == 'disabled') {
                            $checkbox.settings.disabled = v;
                        }
                        $checkbox.attr(k, v);
                    }
                } else {
                    $checkbox.removeAttr(k);
                }
            });
            return $checkbox;
        };
        /**
         * Checkbox DOM
         */
        $checkbox.getDom = function () {
            return $checkbox[0];
        };
        /**
         * Reload
         */
        $checkbox.reload = function () {
            render();
        };
        /**
         * Show or hide
         * @param b
         */
        $checkbox.display = function (b) {
            if (b) {
                $checkbox.show();
            } else {
                $checkbox.hide();
            }
        };
        /**
         * Destroy function
         */
        $checkbox.destroy = function () {
            $checkbox.remove();
        };
        /**
         * Validate
         */
        $checkbox.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                var v = $checkbox.getValue();
                var isOk = false;

                if (settings.required) {
                    isOk = $.sbvalidator.required($checkbox[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }
                return ""; //验证通过
            }
        };

        /**
         * Get input attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($checkbox[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        /**
         * Clear HTML
         */
        function clearCheckbox() {
            $checkbox.html("");
        };

        /**
         * How to generate a checkbox element id
         * @param idx
         * @returns {string}
         */
        function generateId(idx) {
            return $checkbox.settings.name + "_" + idx;
        }

        /**
         * Build Checkbox from data
         * @param data
         */
        function buildCheckbox(data) {
            $.each(data, function (idx, obj) {
                var id = generateId(idx);
                var checkbox = $('<input type="checkbox" name="' + $checkbox.settings.name + '" id="' + id + '"> ');
                var label = $('<label for="' + id + '"></label>');

                $.each(obj, function (k, v) {
                    var isAttr = true;
                    if (k == $checkbox.settings.valueField) {
                        checkbox.val(v);
                        isAttr = false;
                    }
                    if (k == $checkbox.settings.labelField) {
                        label.text(v);
                        isAttr = false;
                    }
                    if (isAttr) {
                        checkbox.attr(k, v);
                    }
                });

                if ($checkbox.settings.disabled) {
                    checkbox.attr('disabled', $checkbox.settings.disabled);
                }
                var $container = $("<div></div>");
                $container.append(checkbox).append(label);
                $checkbox.append($container);
            });

            addEventListener();
        };
        function addEventListener() {
            if ($checkbox.data('$temp')) {
                $checkbox.setValue($checkbox.data('$temp'));
                $checkbox.removeData('$temp');
            }
            // 初始值问题
            if (settings.value) {
                // checked
                $checkbox.setValue(settings.value);
            }

            // 排列问题
            if (settings.direction == 'table') {
                tableRadio();
            } else if (settings.direction == 'row') {
                verticalRadio();
            } else {
                horizontalRadio();
            }
        };

        /**
         * Render checkbox
         */
        function render() {
            // 样式
            $checkbox.addClass(settings.className);
            if ($checkbox.settings.required) {
                $checkbox.attr('required', settings.required);
            }

            if ($checkbox.settings.url) {
                $.ajax({
                    type: "get",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: $checkbox.settings.url,
                    success: function (data) {
                        $checkbox.settings.data = data;
                        clearCheckbox();
                        buildCheckbox($checkbox.settings.data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var e = new Object();
                        e.code = XMLHttpRequest.status;
                        e.msg = $.sberror.format(e.code, this.url);
                        // 根据规范要求将错误交给全局函数处理
                        $.sberror.onError(e);
                    }
                });
            } else {
                clearCheckbox();
                buildCheckbox($checkbox.settings.data);
            }
            setter();
        }

        function tableRadio() {
            var $div = $checkbox.find(":checkbox").parent("div");
            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody></tbody></table>");
            var last;

            $div.each(function (idx) {
                if (idx % settings.columnCount == 0) {
                    last = $(this).wrap("<tr><td></td></tr>");
                } else {
                    last = $(this).insertAfter(last.parent("td")).wrap("<td></td>");
                }
            });
        }

        function verticalRadio() {
            var $div = $checkbox.find(":checkbox").parent("div");

            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody></tbody></table>").wrap("<tr><td></td></tr>");
        }

        function horizontalRadio() {
            var $div = $checkbox.find(":checkbox").parent("div");
            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody><tr></tr></tbody></table>").wrap("<td></td>");
        }

        render();
        return this;
    };
})(jQuery);
