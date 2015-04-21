/**
 * Sinobest-Select 控件
 */
(function ($) {
    var defaults = {
        className:"sinobest-select", //CSS类名
        required:false, // 是否必录
        readonly:false,
        allowEmptyOption:true,
        name:null,
        id:null,
        valueField:"code",
        labelField:"detail",
        value:"",
        data:null,
        url:null,
        multiple:false,
        onChange:null,
        callback:null // 验证方法回调
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
            return $select.$control.val();
        };

        /**
         * Set value
         * @param value new value
         * @return object
         */
        $select.setValue = function (value) {
            return $select.$control.val(value);
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
                        } else if (k == 'readonly') {
                            $select.settings.readonly = v;
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
         * Destory select
         */
        $select.destory = function () {
            return  $select.remove();
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
                        return "不能为空";
                    }
                }
                return ""; //验证通过
            }
        };

        /**
         * As you see for build option
         */
        function buildOption() {
            if ($select.settings.allowEmptyOption) {
                $select.$control.append("<option></option>");
            }
            $.each($select.settings.data, function (idx, obj) {
                var option = $("<option></option>");
                $.each(obj, function (k, v) {
                    if (k == $select.settings.valueField) {
                        option.val(v);
                    } else if (k == $select.settings.labelField) {
                        option.text(v);
                    } else {
                        option.attr(k, v);
                    }
                });
                $select.$control.append(option);
            });
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
            if ($select.settings.readonly) {
                $select.$control.attr('readonly', $select.settings.readonly);
            }
            if ($select.settings.data) {
                // clear all option
                clearOption();
                // data reload
                buildOption($select.settings.data);
            } else {
                // same as getJSON
                $.ajax({type:"get",
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    url:$select.settings.url,
                    success:function (data) {
                        $select.settings.data = data;
                        clearOption();
                        buildOption($select.settings.data);
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        var e = new Object();
                        e.code = textStatus;
                        e.msg = "无法请求获取数据，请求地址：" + this.url;
                        // 根据规范要求将错误交给全局函数处理
                        $.fn.sberror.onerror(e);
                    }
                });
            }

            if ($select.settings.value) {
                $select.val($select.settings.value);
            }
            if ($select.settings.onChange) {
                $select.on('change', $select.settings.onChange);
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
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);