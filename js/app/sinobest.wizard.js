/**
 * Sinobest-wizard
 */
(function ($) {
    var defaults = {
        className: "sinobest-wizard", //CSS类名
        submitButton: "",
        onSeekNext: null,// 切换下一界面后
        onBeforeSeekNext: null,//切换到下一界面前
        next: "下一步",
        prev: "上一步"
    };

    $.fn.sbwizard = function (options) {
        var $wizard = this;
        var settings;
        if (isContain()) {
            if (options) {
                settings = $.extend({}, getter().settings, options || {});
            } else {
                return getter();
            }
        } else {
            settings = $.extend({}, defaults, options || {});
        }

        $wizard.settings = settings;

        function getter() {
            return $wizard.data("$wizard");
        }

        function setter() {
            $wizard.data("$wizard", $wizard);
        }

        $wizard.getState = function () {
            return $.extend({}, getAttributes());
        };

        $wizard.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    $wizard.attr(k, v);
                } else {
                    $wizard.removeAttr(k);
                }
            });
            return $wizard;
        };


        $wizard.getDom = function () {
            return $wizard[0];
        };


        $wizard.reload = function () {
            return render();
        };

        $wizard.display = function (show) {
            if (show) {
                $wizard.show();
            } else {
                $wizard.hide();
            }
            return $wizard;
        };

        $wizard.destroy = function () {
            return $wizard.remove();
        };


        /**
         * Init
         */
        function render() {
            $wizard.addClass($wizard.settings.className);
            var steps = $wizard.find("fieldset");
            $wizard.count = steps.size();
            $wizard.submitBtnName = '#' + $wizard.settings.submitButton;
            $wizard.trueStepIndex = 0;
            $($wizard.submitBtnName).hide();

            $wizard.before("<ul id='steps' class='steps'></ul>");
            steps.each(function (i) {
                $(this).wrap("<div id='step" + i + "'></div>");
                $(this).append("<p id='step" + i + "commands'></p>");

                var name = $(this).find("legend").html();
                $("#steps").append("<li id='stepDesc" + i + "' data-index='" + i + "'>第" + (i + 1) + "步<span>" + name + "</span></li>");

                if (i == 0) {
                    createNextButton(i);
                    selectStep(i);
                } else if (i == $wizard.count - 1) {
                    $("#step" + i).hide();
                    createPrevButton(i);
                } else {
                    $("#step" + i).hide();
                    createPrevButton(i);
                    createNextButton(i);
                }
            });

            $('.steps li').off('click').on('click', function () {
                var current = $(this).parent(".steps").find("li.current");
                var thisIndex = $(this).attr('data-index');
                var currentIndex = current.attr('data-index');
                if (thisIndex > $wizard.trueStepIndex) {
                    return;
                } else {
                    // jump back
                    jumpTo(thisIndex, currentIndex);
                }
            });

            setter();
            return $wizard;
        }

        function createPrevButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Prev' class='prev'>< " + $wizard.settings.prev + "</a>");

            $("#" + stepName + "Prev").bind("click", function (e) {
                $("#" + stepName).hide();
                $("#step" + (i - 1)).show();
                $($wizard.submitBtnName).hide();
                selectStep(i - 1);
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Next' class='next'>" + $wizard.settings.next + " ></a>");

            $("#" + stepName + "Next").bind("click", function (e) {
                // on before seek next
                var isFunc = $.isFunction(options.onBeforeSeekNext);
                var isGoingon = true;// going on as default
                if (isFunc) {
                    isGoingon = options.onBeforeSeekNext(i);
                }
                if (isGoingon) {
                    $("#" + stepName).hide();
                    $("#step" + (i + 1)).show();

                    $wizard.trueStepIndex = i + 1;

                    if (i + 2 == $wizard.count)
                        $($wizard.submitBtnName).show();
                    selectStep(i + 1);

                    // on seek next
                    var isFunc = $.isFunction(options.onSeekNext);
                    if (isFunc) {
                        options.onSeekNext(i);
                    }
                }
            });
        }

        function selectStep(i) {
            $("#steps li").removeClass("current");
            $("#stepDesc" + i).addClass("current");
        }

        function jumpTo(targetIndex, currentIndex) {
            $("#step" + parseInt(currentIndex)).hide();
            $("#step" + parseInt(targetIndex)).show();
            if ((parseInt(targetIndex) + 1) < $wizard.count) {
                $($wizard.submitBtnName).hide();
            } else {
                $($wizard.submitBtnName).show();
            }
            selectStep(targetIndex);
        }

        function isContain() {
            return $wizard.data("$wizard");
        }

        /**
         * Get input attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($wizard[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        return this.each(function () {
            render();
        });
    };
})(jQuery);