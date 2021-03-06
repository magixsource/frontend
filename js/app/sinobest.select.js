/**
 * Sinobest-Select
 */
(function ($) {
    var defaults = {
        className: "sinobest-select", //CSS类名
        required: false, // 是否必录
        disabled: false,
        allowEmptyOption: true,
        name: null,
        id: null,
        valueField: "code",
        labelField: "detail",
        value: "",
        data: null,
        url: null,
        multiple: false,
        size: null,
        onChange: null,
        callback: null // 验证方法回调
    };

    $.fn.sbselect = function (options) {
        var settings;
        var $select = this;
        if (isContain()) {
            if (options) {
                settings = $.extend({}, getter().settings, options || {});
            } else {
                return getter();
            }
        } else {
            settings = $.extend({}, defaults, options || {});
        }
        $select.settings = settings;

        function getter() {
            return $select.data("$select");
        }

        function setter() {
            $select.data("$select", $select);
        }

        /**
         * Check is containe by jquery.data
         * @returns {*}
         */
        function isContain() {
            return $select.data("$select");
        }

        /**
         * Get value
         * @return  object
         */
        $select.getValue = function () {
            return $select.$control.val();
        };

        /**
         * Set value
         * @param value new value
         * @return object
         */
        $select.setValue = function (value) {
            // 异步请求中，如果请求未结束，将value存储于内存中，请求结束后从内存中读值
            if (!$select.settings.data) {
                $select.data('$temp', value);
                return $select;
            }

            $select.$control.val(value);

            // disabled Hack
            if ($select.settings.disabled && ($select.settings.multiple || $select.settings.size)) {
                // option.addClass('option-selected');
                $select.$control.find("option").not(":selected").removeClass("option-selected");
                $select.$control.find("option:selected").addClass("option-selected");
            }

            return $select;
        };

        /**
         * Get selected text
         * @return {*}
         */
        $select.getDetail = function () {
            return $select.$control.find('option:selected').text();
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
                if (v) {
                    if (k == 'value') {
                        $select.setValue(v);
                    } else {
                        if (k == 'required') {
                            $select.settings.required = v;
                        } else if (k == 'disabled') {
                            $select.settings.disabled = v;
                            if (v) {
                                toggleDisabledClass(true);
                            } else {
                                toggleDisabledClass(false);
                            }
                        }
                        $select.attr(k, v);
                    }
                } else {
                    $select.removeAttr(k);
                }
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
         * Destroy select
         */
        $select.destroy = function () {
            return $select.remove();
        };

        /**
         * Validate
         */
        $select.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                var v = $select.getValue();
                var isOk = false;

                if (settings.required) {
                    isOk = $.sbvalidator.required($select.$control[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }
                return ""; //验证通过
            }
        };

        /**
         * enabled or disabled class
         */
        function toggleDisabledClass(flag) {
            if (flag) {
                $select.$control.addClass('select-disabled');
            } else {
                $select.$control.removeClass('select-disabled');
            }
        }

        /**
         * As you see for build option
         */
        function buildOption(data) {
            if ($select.settings.allowEmptyOption) {
                $select.$control.append("<option></option>");
            }
            $.each(data, function (idx, obj) {
                var option = $("<option></option>");
                $.each(obj, function (k, v) {
                    var isAttr = true;
                    if (k == $select.settings.valueField) {
                        option.val(v);
                        isAttr = false;
                    }
                    if (k == $select.settings.labelField) {
                        option.text(v);
                        isAttr = false;
                    }
                    if (isAttr) {
                        option.attr(k, v);
                    }
                });
                $select.$control.append(option);
            });

            addEventListener();
        };

        /**
         * Init value and add Event Listener
         * 因为有可能数据是异步加载过来的，所以初始化监听之类的操作，建议放在BuildOption之后
         */
        function addEventListener() {
            if ($select.settings.value) {
                $select.setValue($select.settings.value);
            }
            // 从内存中获取未赋的值
            if ($select.data('$temp')) {
                $select.setValue($select.data('$temp'));
                $select.removeData('$temp');
            }
            if ($select.settings.onChange) {
                $select.$control.off('change').on('change', $select.settings.onChange);
            }
        };

        function clearOption() {
            $select.$control.find("option").remove();
        };

        /**
         * Init
         */
        function render() {
            if ($select.settings.multiple) {
                $select.html('<select multiple></select>');
                if ($select.settings.size) {
                    $select.find("select").attr("size", $select.settings.size);
                }
            } else {
                $select.html('<select></select>');
            }

            $select.$control = $select.find("select");
            $select.addClass($select.settings.className);

            if ($select.settings.id) {
                $select.$control.attr('id', $select.settings.id);
            }
            if ($select.settings.name) {
                $select.$control.attr('name', $select.settings.name);
            }
            if ($select.settings.required) {
                $select.$control.attr('required', $select.settings.required);
            }
            if ($select.settings.disabled) {
                $select.$control.attr('disabled', $select.settings.disabled);
                toggleDisabledClass(true);
            }
            if ($select.settings.data) {
                // clear all option
                clearOption();
                // data reload
                buildOption($select.settings.data);
            } else {
                // same as getJSON
                $.ajax({
                    type: "get",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: $select.settings.url,
                    success: function (data) {
                        $select.settings.data = data;
                        clearOption();
                        buildOption($select.settings.data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var e = new Object();
                        e.code = XMLHttpRequest.status;
                        e.msg = $.sberror.format(e.code, this.url);
                        // 根据规范要求将错误交给全局函数处理
                        $.sberror.onError(e);
                    }
                });
            }

            setter();
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
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);