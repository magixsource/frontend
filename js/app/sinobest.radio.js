(function ($) {
    var defaults = {
        className:"sinobest-radio", //CSS类名
        required:false, // 是否必录
        readonly:false,
        direction:'horizontal', //vertical、table
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
            } else {
                $radio.hide();
            }
        };
        $radio.destory = function () {
            $radio.remove();
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

        }

        function tableRadio() {

        }

        function verticalRadio() {

        }

        function horizontalRadio() {

        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);
