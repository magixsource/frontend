/**
 * sinobeset-radio
 */
(function ($) {
    var defaults = {
        className: "sinobest-radio", //CSS类名
        required: false, // 是否必录
        disabled: false,
        name: null,
        direction: 'line', //row、table
        columnCount: null,
        data: null, // [{"code":"male","detail":"Male"},{"code":"female","detail":"Female"}]
        url: null,
        valueField: "code",
        labelField: "detail",
        callback: null, //验证回调函数名
        value: ""
    };

    $.fn.sbradio = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $radio = this;
        $radio.settings = settings;

        /**
         * Get Value
         * @return {*}
         */
        $radio.getValue = function () {
            return $radio.find(":radio").filter(':checked').val() || "";
        };

        /**
         * Set Radio Value
         * @param v
         * @return {*}
         */
        $radio.setValue = function (v) {
            $radio.find(":radio").filter(':checked').prop('checked', false);
            if (v) {
                $radio.find(":radio").filter('[value=' + v + ']').prop('checked', true);
            }
            return $radio;
        };

        /**
         * Get Selection Text
         * @return {*}
         */
        $radio.getDetail = function () {
            return $radio.find(":radio").filter(':checked').next("label").text();
        };

        /**
         * Radio state
         * @return {*}
         */
        $radio.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set new state
         * @param stateJson
         * @return {*}
         */
        $radio.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $radio.setValue(v);
                    } else {
                        if (k == 'required') {
                            $radio.settings.required = v;
                        } else if (k == 'disabled') {
                            $radio.settings.disabled = v;
                        }
                        $radio.attr(k, v);
                    }
                } else {
                    $radio.removeAttr(k);
                }
            });
            return $radio;
        };
        /**
         * Radio DOM
         * 返回最外层DIV
         */
        $radio.getDom = function () {
            return $radio[0];
        };
        $radio.reload = function () {
            render();
        };

        $radio.display = function (b) {
            if (b) {
                $radio.show();
            } else {
                $radio.hide();
            }
        };
        /**
         * 控件销毁函数
         */
        $radio.destroy = function () {
            $radio.remove();
        };

        /**
         * 验证函数
         * @return {*}
         */
        $radio.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                var v = $radio.getValue();
                var isOk = false;

                if (settings.required) {
                    isOk = $.sbvalidator.required($radio[0], v);
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
            $.each($radio[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        /**
         * Always build from data
         */
        function buildRadio(data) {
            $.each(data, function (idx, obj) {
                var radio = $('<input type="radio" name="' + $radio.settings.name + '"> ');
                var label = $('<label></label>');

                $.each(obj, function (k, v) {
                    if (k == $radio.settings.valueField) {
                        radio.val(v);
                    } else if (k == $radio.settings.labelField) {
                        label.text(v);
                    } else {
                        radio.attr(k, v);
                    }
                });

                if ($radio.settings.disabled) {
                    radio.attr('disabled', $radio.settings.disabled);
                }
                var $container = $("<div></div>");
                $container.append(radio).append(label);
                $radio.append($container);

            });

            addEventListener();
        };

        /**
         * Init value or event
         */
        function addEventListener() {
            // 初始值问题
            if (settings.value) {
                // checked
                $radio.find(":radio").prop('checked', false);//全非选
                $radio.find(":radio").filter('[value=' + settings.value + ']').prop('checked', true);
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
         * Clear radio
         */
        function clearRadio() {
            $radio.html("");
        };

        /**
         * 渲染控件,支持本地数据和远程数据
         */
        function render() {
            // 样式
            $radio.addClass(settings.className);

            if ($radio.settings.required) {
                $radio.attr('required', settings.required);
            }
            if ($radio.settings.url) {
                // 异步-Remote url
                $.ajax({
                    type: "get",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: $radio.settings.url,
                    success: function (data) {
                        $radio.settings.data = data;
                        clearRadio();
                        buildRadio($radio.settings.data);
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
                // 同步-Local data
                clearRadio();
                buildRadio($radio.settings.data);
            }
        }

        /**
         * 按每行显示几列这样的表格排列
         */
        function tableRadio() {
            var $div = $radio.find(":radio").parent("div");
            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody></tbody></table>");
            var last;
            $div.each(function (idx) {
                if (idx % settings.columnCount == 0) {
                    last = $(this).wrap("<tr><td></td></tr>");
                } else {
                    $(this).insertAfter(last.parent("td")).wrap("<td></td>");
                }
            });
        }

        /**
         * 按行排列
         */
        function verticalRadio() {
            var $div = $radio.find(":radio").parent("div");
            // 排序基本结构在reload的时候不需要重构
            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody></tbody></table>").wrap("<tr><td></td></tr>");
        }

        /**
         * 排成一行显示
         */
        function horizontalRadio() {
            var $div = $radio.find(":radio").parent("div");
            if ($div.parent("td").length > 0) {
                return;
            }
            $div.wrapAll("<table><tbody><tr></tr></tbody></table>").wrap("<td></td>");
        }

        render();
        return this;
    };
})(jQuery);
