(function ($) {
    var defaults = {
        className:"sinobest-checkbox", //CSS类名
        required:false, // 是否必录
        readonly:false,
        direction:'line', //row、table
        columnCount:null,
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
            $checkbox.wrapAll("<table>");
            var last;
            $checkbox.each(function (idx) {
                if (idx % settings.columnCount == 0) {
                    last = $(this).wrap("<tr>").wrap("<td>");
                } else {
                    $(this).insertAfter(last.parent("td")).wrap("<td>");
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
            $checkbox.wrapAll("<table>").wrap("<tr><td>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        function horizontalRadio() {
            if ($checkbox.parent("td").length > 0) {
                return;
            }
            $checkbox.wrapAll("<table><tr>").wrap("<td>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        render();
        return this;

    };
})(jQuery);
