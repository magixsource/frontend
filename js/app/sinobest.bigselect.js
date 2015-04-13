(function ($) {
    var defaults = {
        className:"sinobest-bigselect", //CSS类名
        required:false, // 是否必录
        readonly:false,
        disabled:false,
        url:null,
        type:'single', // multiple
        pageSize:10,
        paging:null,
        valueField:"code",
        labelField:"detail",
        searchField:["detail"],
        options:[],
        persist:null,
        create:null,
        onItemAdd:null,
        onItemRemove:null,
        plugins:null,
        value:null
    };

    $.fn.sbbigselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $bigselect = this;
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
                    "code":item[key],
                    "detail":item[label]
                });
                control.addItem(item[key]);
            }
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
        $bigselect.destory = function () {
            $bigselect.remove();
            control.$wrapper.remove();
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

        function render() {
            $bigselect.addClass(settings.className);

            if (settings.paging == "true") {
                settings.plugins = new Object();
                settings.plugins['paging_footer'] = {
                    url:settings.url,
                    pagesize:settings.pageSize
                };
            }
            if (typeof settings.plugins == 'undefined') {
                settings.plugins = new Object();
            }
            if (settings.type == 'multiple') {
                renderMultiple();
            } else {
                renderSingle();
            }

            var persist = test(settings.persist, true);
            var create = test(settings.create, false);

            // 声明
            $select = $($bigselect.selector).selectize({
                valueField:settings.valueField,
                labelField:settings.labelField,
                searchField:settings.searchField,
                options:[],
                persist:persist,
                create:create,
                onItemAdd:settings.onItemAdd,
                onItemRemove:settings.onItemRemove,
                plugins:settings.plugins
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
            if (settings.required) {
                $bigselect.attr('required', settings.required);
            }
        }

        function test(v, d) {
            if (null == v) {
                return d;
            }
            return v;
        }

        function renderSingle() {
            // for single mode
            settings.plugins['single_clear_button'] = {
                className:'clearSelection',
                label:'',
                title:''
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
