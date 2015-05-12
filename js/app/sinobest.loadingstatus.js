/**
 * Loading status is a component that using in ajax invoked
 * to show a loading img mean ajax is requesting,please wait
 */
(function ($) {
    $.extend({
        sbloadingstatus: function (options) {
            var defaults = {
                className: "sinobest-loadingstatus", //CSS类名
                loadingClassName: "sinobest-loading",
                mode: "auto"
            };
            var settings = $.extend({}, defaults, options || {});
            var $this = this;

            /**
             * Add loading class to body
             */
            this.open = function () {
                $('body').addClass(settings.loadingClassName);
                // ajax
                $(document).on({
                    ajaxStop: function () {
                        $this.close();
                    }
                });
            };

            /**
             * Remove loading class from body
             */
            this.close = function () {
                $('body').removeClass(settings.loadingClassName);
            };

            /**
             * Render component
             */
            function render() {
                buildContainer();
                addListener();
            };

            /**
             * Loading status component need a container,DOM span here
             */
            function buildContainer() {
                $this.$container = '<span class="' + settings.className + '"></span>';
                $("body").append($this.$container);
            };
            /**
             * Usually,we use auto mode just
             */
            function addListener() {
                if (settings.mode == 'auto') {
                    $(document).on({
                        ajaxStart: function () {
                            $('body').addClass(settings.loadingClassName);
                        },
                        ajaxStop: function () {
                            $this.close();
                        }
                    });
                }
            };

            render();
            return this;
        }
    });

})(jQuery);