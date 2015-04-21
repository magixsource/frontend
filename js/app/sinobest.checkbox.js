(function ($) {
    var defaults = {
        className:"sinobest-checkbox", //CSS类名
        required:false, // 是否必录
        readonly:false,
        direction:'line', //row、table
        columnCount:null,
        delimiter:null, // 分隔符、若为空则返回数组
        name:null,
        valueField:"code",
        labelField:"detail",
        data:null,
        url:null,
        callback:null,
        value:""
    };

    $.fn.sbcheckbox = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $checkbox = this;
        $checkbox.settings = settings;

        $checkbox.getValue = function () {
            // 多选，按什么符号分隔开
            var chkValue = [];
            $checkbox.filter(':checked').each(function () {
                chkValue.push($(this).val());
            });
            return chkValue;
        };

        $checkbox.setValue = function (v) {
            var currentValue = $checkbox.getValue();
            $.each(currentValue, function (idx, value) {
                $checkbox.filter('[value=' + value + ']').prop('checked', false);
            });

            if (!$.isArray(v)) {
                v = [v];
            }
            $.each(v, function (idx, value) {
                $checkbox.filter('[value=' + value + ']').prop('checked', true);
            });

            return $checkbox;
        };

        $checkbox.getState = function () {
            // 这里会是多个项,怎么获取和设置？
        };
        $checkbox.setState = function () {
        };
        $checkbox.getDom = function () {
        };
        $checkbox.reload = function () {
            render();
        };
        $checkbox.display = function (b) {
            if (b) {
                $checkbox.show();
                $checkbox.next("label").show();
            } else {
                $checkbox.hide();
                $checkbox.next("label").hide();
            }
        };
        $checkbox.destory = function () {
            $checkbox.remove();
            $checkbox.next("label").remove();
        };
        $checkbox.validate = function () {

        };

        function render() {
            // 样式
            $checkbox.addClass(settings.className);
            if (settings.direction == 'table') {
                tableRadio();
            } else if (settings.direction == 'row') {
                verticalRadio();
            } else {
                //horizontal
                horizontalRadio();
            }

        }

        function tableRadio() {
            if ($checkbox.parent("td").length > 0) {
                return;
            }
            $checkbox.wrapAll("<table><tbody></tbody></table>");
            var last;
            $checkbox.each(function (idx) {
                if (idx % settings.columnCount == 0) {
                    last = $(this).wrap("<tr><td></td></tr>");
                } else {
                    $(this).insertAfter(last.parent("td")).wrap("<td></td>");
                }
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        function verticalRadio() {
//            $checkbox.wrapAll("<ul class='sinobest-ul'>").wrap('<li>').addClass('sinobest-v-li').each(function () {
//                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
//            });
            if ($checkbox.parent("td").length > 0) {
                return;
            }
            $checkbox.wrapAll("<table><tbody></tbody></table>").wrap("<tr><td></td></tr>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        function horizontalRadio() {
            if ($checkbox.parent("td").length > 0) {
                return;
            }
            $checkbox.wrapAll("<table><tbody><tr></tr></tbody></table>").wrap("<td></td>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        render();
        return this;

    };
})(jQuery);
