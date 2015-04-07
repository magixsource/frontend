(function ($) {
    var defaults = {
        className:"sinobest-checkbox", //CSS类名
        required:false, // 是否必录
        readonly:false,
        direction:'horizontal', //vertical、table
        value:""
    };

    $.fn.sbcheckbox = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $checkbox = this;
        $checkbox.settings = settings;

        $checkbox.getValue = function () {
            return $checkbox.filter(':checked').val();
        };

        $checkbox.setValue = function (v) {
            var currentValue = $checkbox.getValue();

            $checkbox.filter('[value=' + currentValue + ']').prop('checked', false);
            return $checkbox.filter('[value=' + v + ']').prop('checked', true);
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
            } else {
                $checkbox.hide();
            }
        };
        $checkbox.destory = function () {
            $checkbox.remove();
        };

        function render() {
            // 样式
            $checkbox.addClass(settings.className);
            if (settings.direction == 'table') {
                tableRadio();
            } else if (settings.direction == 'vertical') {
                verticalRadio();
            } else {
                //horizontal
                horizontalRadio();
            }

        }

        function tableRadio() {

        }

        function verticalRadio() {

        }

        function horizontalRadio() {
            $checkbox.wrapAll("<ul class='sinobest-ul'>").wrap('<li>').addClass('sinobest-v-li');
        }

        render();
        return this;

    };
})(jQuery);
