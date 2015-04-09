(function ($) {
    var defaults = {
        className:"sinobest-radio", //CSS类名
        required:false, // 是否必录
        readonly:false,
        direction:'horizontal', //vertical、table
        columnCount:null,
        value:""
    };

    $.fn.sbradio = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $radio = this;
        $radio.settings = settings;

        $radio.getValue = function () {
            return $radio.filter(':checked').val();
        };

        $radio.setValue = function (v) {
            var currentValue = $radio.getValue();
            // jq 1.6之后，用prop代替attr
            $radio.filter('[value=' + currentValue + ']').prop('checked', false);
            return $radio.filter('[value=' + v + ']').prop('checked', true);
        };

        $radio.getDetail = function () {
            return $radio.filter(':checked').next("label").text();
        };

        $radio.getState = function () {
        };
        $radio.setState = function () {
        };
        $radio.getDom = function () {
        };
        $radio.reload = function () {
            render();
        };
        $radio.display = function (b) {
            if (b) {
                $radio.show();
                $radio.next("label").show();
            } else {
                $radio.hide();
                $radio.next("label").hide();
            }
        };
        $radio.destory = function () {
            $radio.remove();
            $radio.next("label").remove();
        };

        function render() {
            // 样式
            $radio.addClass(settings.className);
            if (settings.direction == 'table') {
                tableRadio();
            } else if (settings.direction == 'vertical') {
                verticalRadio();
            } else {
                //horizontal
                horizontalRadio();
            }

            if (settings.readonly) {
                $radio.attr('readonly', settings.readonly);
            }
            if (settings.required) {
                $radio.attr('required', settings.required);
            }
            if (settings.value) {
                // checked
                $radio.prop('checked', false);//全非选
                $radio.filter('[value=' + settings.value + ']').prop('checked', true);
            }

        }

        function tableRadio() {
            if ($radio.parent("td").length > 0) {
                return;
            }
            $radio.wrapAll("<table>");
            var last;
            $radio.each(function (idx) {
                if (idx % settings.columnCount == 0) {
                    last = $(this).wrap("<tr>").wrap("<td>");
                } else {
                    $(this).insertAfter(last.parent("td")).wrap("<td>");
                }
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        function verticalRadio() {
//            $radio.wrapAll("<ul class='sinobest-ul'>").wrap('<li>').addClass('sinobest-v-li').each(function () {
//                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
//            });
            // 排序基本结构在reload的时候不需要重构
            if ($radio.parent("td").length > 0) {
                return;
            }
            $radio.wrapAll("<table>").wrap("<tr><td>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        function horizontalRadio() {
            if ($radio.parent("td").length > 0) {
                return;
            }
            $radio.wrapAll("<table><tr>").wrap("<td>").each(function () {
                $('label[for=' + $(this).attr('id') + ']').insertAfter($(this));
            });
        }

        render();
        return this;
    };
})(jQuery);
