(function ($) {
    var defaults = {
        className: "sinobest-bigselect", //CSS类名
        required: false, // 是否必录
        readonly: false,
        disabled: false,
        url: null,
        saveType: "c", //d
        type: 'single', // multiple
        pageSize: 10,
        paging: null,
        valueField: "code",
        labelField: "detail",
        searchField: ["detail"],
        options: [],
        persist: null,
        create: null,
        onItemAdd: null,
        onItemRemove: null,
        plugins: null,
        editEnable: false, //是否开启编辑模式
        name: "",
        id: "",
        callback: null,
        value: null
    };

    $.fn.sbbigselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $bigselect = this;
        if (settings.editEnable) {
            // 编辑模式强制saveType为detail
            settings.saveType = "d";
        }

        if (settings.saveType == "d") {
            settings.valueField = settings.labelField;
        }
        $bigselect.settings = settings;

        var $select;
        var control;

        $bigselect.getValue = function () {
            return control.getValue();
        };
        $bigselect.setValue = function (v) {
            //control.setValue(v);
            if (control == null) {
                return;
            }

            var key = settings.valueField;
            var label = settings.labelField;

            for (var i = 0; i < v.length; i++) {
                var item = v[i];
                control.addOption({
                    "code": item[key],
                    "detail": item[label]
                });
                control.addItem(item[key]);
            }
        };

        $bigselect.getDetail = function () {
            return control.getItems();
        };

        $bigselect.getState = function () {
            return $.extend({}, getAttributes());
        };

        $bigselect.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                control.$wrapper.attr(k, v);
            });
            return $bigselect;
        };

        $bigselect.getDom = function () {
            return control.$wrapper[0];
        };

        $bigselect.reload = function () {
            render();
        };

        $bigselect.display = function (b) {
            if (b) {
                control.$wrapper.show();
            } else {
                control.$wrapper.hide();
            }
        };

        $bigselect.destroy = function () {
            $bigselect.remove();
            control.$wrapper.remove();
        };

        $bigselect.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                var v = $bigselect.getValue();
                var isOk = false;

                if (settings.required) {
                    isOk = $.sbvalidator.required($bigselect[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }
                return ""; //验证通过
            }
        };

        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($bigselect.getDom().attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        /**
         * Build Input when single or Select when multiple
         */
        function build() {
            if (settings.type == 'multiple') {
                buildSelect(true);
                renderMultiple();
            } else {
                buildSelect(false);
                renderSingle();
            }
            if (settings.editEnable) {
                settings.createOnBlur = true;
                settings.keepTextOnBlur = true;
                settings.plugins['smart_tag'] = {};
            }
            // selectize-icon
            settings.plugins['smart_icon'] = {};
        }

        function buildSelect(multiple) {
            var $select = $('<select id="' + settings.id + '" name="' + settings.name + '"></select>');
            if (multiple) {
                $select.attr("multiple", true);
            }
            if (settings.required) {
                $select.attr("required", settings.required);
            }
            $bigselect.append($select);
        }

        function buildInput() {
            var $input = $('<input type="text" name="' + settings.name + '" id="' + settings.id + '">');
            if (settings.required) {
                $input.attr("required", settings.required);
            }
            $bigselect.append($input);
        }

        function render() {
            $bigselect.addClass(settings.className);

            if (settings.paging == "true") {
                settings.plugins = new Object();
                settings.plugins['paging_footer'] = {
                    url: settings.url,
                    pagesize: settings.pageSize
                };
            }
            if (typeof settings.plugins == 'undefined') {
                settings.plugins = new Object();
            }

            build();

            var persist = getOrElse(settings.persist, true);
            var create = getOrElse(settings.create, false);
            var createOnBlur = getOrElse(settings.createOnBlur, false);
            var keepTextOnBlur = getOrElse(settings.keepTextOnBlur, false);

            // 声明
            $select = $($bigselect.selector).find('[name="' + settings.name + '"]').selectize({
                valueField: settings.valueField,
                labelField: settings.labelField,
                searchField: settings.searchField,
                options: [],
                persist: persist,
                create: create,
                createOnBlur: createOnBlur,
                keepTextOnBlur: keepTextOnBlur,
                onItemAdd: settings.onItemAdd,
                onItemRemove: settings.onItemRemove,
                plugins: settings.plugins
            });
            control = $select[0].selectize;

            // readonly
            if (settings.readonly) {
                control.lock();
            }
            // disabled
            if (settings.disabled) {
                control.disable();
            }
            // init value
            var initValue = settings.value;
            if (initValue != null) {
                initValue = eval("(" + initValue + ")");
                $bigselect.setValue(initValue);
            }
//            if (settings.required) {
//                $bigselect.attr('required', settings.required);
//            }
        }

        /**
         * Safe setter,return default value when v equals null or undefined
         * @param v
         * @param d
         * @return {*}
         */
        function getOrElse(v, d) {
            if (!v) {
                return d;
            }
            return v;
        }

        function renderSingle() {
            // for single mode
            settings.plugins['single_clear_button'] = {
                className: 'clearSelection',
                label: '',
                title: ''
            };
        };
        function renderMultiple() {
            settings.pagesize = settings.pageSize;
            settings.plugins['toolbar_header'] = {};
        };

        render();
        return this;
    };
})(jQuery);
