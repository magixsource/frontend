/**
 * Sinobest-areaselect
 */
(function ($) {
    var defaults = {
        className: "sinobest-areaselect", //CSS类名
        required: false, // 是否必录
        placeholder: null,
        disabled: null,
        readonly: false,
        callback: null,
        data: null,// 一次性完全数据
        url: null,// ajax异步请求数据
        rootId: null,//数据的根节点id
        level: 3,
        value: ""
    };

    $.fn.sbareaselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $areaselect = this;
        $areaselect.settings = settings;

        /**
         * Get text value
         * @return  object
         */
        $areaselect.getValue = function () {
            return $areaselect.$input.val();
        };

        /**
         * Set text value
         * @param value new value
         * @return object
         */
        $areaselect.setValue = function (value) {
            return $areaselect.$input.val(value);
        };
        /**
         * Get text state
         * @return object
         */
        $areaselect.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set text new state
         * @param stateJson state json
         * @return  object
         */
        $areaselect.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $areaselect.setValue(v);
                    } else if (k == 'required') {
                        $areaselect.settings.required = v;
                        $areaselect.$input.attr('required', $areaselect.settings.required);
                    } else if (k == 'readonly') {
                        $areaselect.settings.readonly = v;
                        $areaselect.$input.attr('readonly', $areaselect.settings.readonly);
                    } else if (k == 'disabled') {
                        $areaselect.settings.disabled = v;
                        $areaselect.$input.attr('disabled', $areaselect.settings.disabled);
                        if (v) {
                            toggleDisabledClass(true);
                        } else {
                            toggleDisabledClass(false);
                        }
                    } else {
                        $areaselect.attr(k, v);
                    }
                } else {
                    $areaselect.removeAttr(k);
                }
            });
            return $areaselect;
        };

        /**
         * Get HTML DOM
         * @return DOM object
         */
        $areaselect.getDom = function () {
            return $areaselect[0];
        };

        /**
         * Reload text
         * @return object
         */
        $areaselect.reload = function () {
            return render();
        };
        /**
         * Text show or hide
         * @param show show or hide
         * @return object
         */
        $areaselect.display = function (show) {
            if (show) {
                $areaselect.show();
            } else {
                $areaselect.hide();
            }
            return $areaselect;
        };
        /**
         * Destroy text
         */
        $areaselect.destroy = function () {
            return $areaselect.remove();
        };

        /**
         * Validate input
         */
        $areaselect.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                // basic validate
                var v = $areaselect.getValue();

                var isOk = false;
                if (settings.required) {
                    isOk = $.sbvalidator.required($areaselect.$input[0], v);
                    if (!isOk) {
                        return $.sbvalidator.TEXT_REQUIRED;
                    }
                }

                return ""; //验证通过
            }
        };

        /**
         * Build input
         */
        function buildInput() {
            $areaselect.$input = $('<input type="text" class="areaselect-input">');
            //$areaselect.$input.wrapAll('<span></span>')
            $areaselect.append($areaselect.$input);
        }

        /**
         * Init
         */
        function render() {
            $areaselect.addClass($areaselect.settings.className);
            buildInput();
            if ($areaselect.settings.required) {
                $areaselect.$input.attr('required', $areaselect.settings.required);
            }
            if ($areaselect.settings.placeholder) {
                $areaselect.$input.attr('placeholder', $areaselect.settings.placeholder);
                // 测试是否支持
                if (!isPlaceHolderSupported()) {
                    $areaselect.$input.placeholder();
                }
            }
            if ($areaselect.settings.readonly) {
                $areaselect.$input.attr('readonly', 'readonly');
            }
            if ($areaselect.settings.disabled) {
                $areaselect.$input.attr('disabled', 'disabled');
                toggleDisabledClass(true);
            }
            if ($areaselect.settings.value) {
                $areaselect.$input.val($areaselect.settings.value);
            }

            // event listener
            $areaselect.$input.on('click', function () {
                // build or not
                if (!$areaselect.isBuilded) {
                    buildDropdown();
                    $areaselect.isBuilded = true;
                    afterBuildDropdown();
                }
                //showDropdown();
                $areaselect.$dropdown.show();
            });

            return $areaselect;
        }

        function removeCurr() {
            $areaselect.find(".tab-curr").removeClass("tab-curr");
        }

        function addCurr($obj) {
            $obj.addClass('tab-curr');
        }

        function hideTab(index) {
            $areaselect.find('.tab-content[data-area=' + index + ']').hide();
        }

        function showTab(index) {
            $areaselect.find('.tab-content[data-area=' + index + ']').show();
        }

        function afterBuildDropdown() {
            // set first as current
            addCurr($areaselect.find(".dropdown-content-tab li").eq(0));
            // close handle
            $areaselect.find('.areaselect-dropdown-close').click(function () {
                $areaselect.$dropdown.hide();
            });

            // tabs handle
            $areaselect.find(".dropdown-content-tab li").on('click', function () {
                if ($(this).hasClass("tab-curr")) {
                    return false;
                }
                // remove tab-curr style
                $areaselect.find(".tab-curr").each(function () {
                    // dischoised and hide it
                    var index = $(this).attr('data-index');
                    hideTab(index);
                });
                removeCurr();
                // choiced and show it
                addCurr($(this));
                var index = $(this).attr('data-index');
                showTab(index);
            });

            // list content handle
            $areaselect.on('click', '.area-list-content a', function () {
                // clear
                $areaselect.find('.area-list-content a.selected').removeClass('selected');
                // 选中
                $(this).addClass('selected');
                var text = $(this).text();
                $areaselect.$input.val(text);
                // refresh tab title
                var tabIndex = $(this).parents('.tab-content').eq(0).attr('data-area');
                tabIndex = parseInt(tabIndex);
                refreshTabText(tabIndex, text);
                // close dropdown or not
            }).on('mouseenter', '.area-list-content a', function () {
                $(this).next(".next-level").show();
            }).on('mouseleave', '.area-list-content li', function () {
                // clear style
                $(this).find(".next-level").hide();
            }).on('click', '.next-level', function () {// next level handle
                // refresh tab-content by value
                var value = $(this).prev("a").eq(0).attr('data-value');
                var text = $(this).prev("a").eq(0).text();


                var tabIndex = $(this).parents('.tab-content').eq(0).attr('data-area');
                tabIndex = parseInt(tabIndex);
                // refresh title
                refreshTabText(tabIndex, text);
                // hide current
                hideTab(tabIndex);
                removeCurr();
                // show target
                var targetIndex = tabIndex + 1;
                // refresh area-list content before show it
                refreshAreaList(targetIndex, value);

                showTab(targetIndex);
                addCurr($areaselect.find('.dropdown-content-tab li[data-index=' + targetIndex + ']'));
            });

        }

        /**
         * Refresh tab text
         * @param level
         * @param text
         */
        function refreshTabText(level, text) {
            var refreshText = text || "请选择";
            var $container = $areaselect.find('.dropdown-content-tab li[data-index=' + level + ']');
            $container.find("em").text(refreshText);

            // refresh next level if nessesary
            var nextLevelIndex = parseInt(level) + 1;
            var nextLevel = $areaselect.find('.dropdown-content-tab li[data-index=' + nextLevelIndex + ']');
            if (nextLevel.length > 0) {
                refreshTabText(nextLevelIndex, null);
            }
        }

        /**
         * Get level data,Should support ajax lazy data and already load data
         * @param level
         */
        function getDataByParent(pid) {
            var array = new Array();
            if ($areaselect.settings.ajaxMode) {
                // Yep,ajax mode
            } else {
                $.each($areaselect.settings.data, function (idx) {
                    var p = $(this).attr('parent');
                    if (p == pid) {
                        array.push($(this));
                    }
                });
            }
            return array;
        }

        /**
         * Build area dropdown content
         */
        function buildDropdown() {
            // validate data
            var maxLevel = 1;
            $.each($areaselect.settings.data, function (idx) {
                var level = $(this).attr('level');
                maxLevel = Math.max(maxLevel, level);
            });
            $areaselect.settings.level = Math.max($areaselect.settings.level, maxLevel);

            $areaselect.$dropdown = $('<span class="areaselect-dropdown"></span>');
            $areaselect.$dropdownContent = $('<div class="areaselect-dropdown-content"></div>');
            $areaselect.$dropdownTabs = $('<div class="dropdown-content-tabs"></div>');

            // build tabs-header
            var $tabHeader = $('<ul class="dropdown-content-tab"></ul>');
            for (var i = 0; i < $areaselect.settings.level; i++) {
                var $li = $('<li data-index="' + i + '"><a href="###"><em>请选择</em><i></i></a></li>');
                $tabHeader.append($li);
            }
            $areaselect.$dropdownTabs.append($tabHeader);

            // build tabs-body
            for (var i = 0; i < $areaselect.settings.level; i++) {
                var $body = $('<div class="tab-content" data-area="' + i + '"><ul class="area-list-content"></ul></div>');
                if (i == 0) {
                    var html = buildAreaList(i, $areaselect.settings.rootId);
                    $body.find('ul.area-list-content').append($(html));
                }
                $areaselect.$dropdownTabs.append($body);
            }


            // add tabs
            $areaselect.$dropdownContent.append($areaselect.$dropdownTabs);
            // add close btn
            $areaselect.$dropdownContent.append('<div class="areaselect-dropdown-close"></div>');
            // final
            $areaselect.$dropdown.append($areaselect.$dropdownContent);
            $areaselect.append($areaselect.$dropdown);
        }

        /**
         * Build Area-list content
         * @param level which level
         * @param rootId
         * @returns {string}
         */
        function buildAreaList(level, rootId) {
            var subData = getDataByParent(rootId);
            var html = "";
            $.each(subData, function () {
                html += '<li><a href="###" data-value="' + $(this).attr('code') + '">' + $(this).attr('detail') + '</a><div class="next-level"></div></li>';
            });
            return html;
        }


        /**
         * Refresh Area-list content
         * @param level
         * @param rootId
         */
        function refreshAreaList(level, rootId) {
            var currentLevel = parseInt(level);
            // clear
            var $container = $areaselect.find('.tab-content[data-area=' + currentLevel + '] ul.area-list-content');
            //rebuild
            var html = "";
            if (rootId) {
                html = buildAreaList(currentLevel, rootId);
            }
            $container.html(html);

            // Next level handle
            currentLevel = currentLevel + 1;
            var nextLevel = $areaselect.find('.tab-content[data-area=' + currentLevel + '] ul.area-list-content');
            if (nextLevel.length > 0) {
                refreshAreaList(currentLevel);
            }
        }

        /**
         * enabled or disabled class
         */
        function toggleDisabledClass(flag) {
            if (flag) {
                $areaselect.$input.addClass('input-disabled');
            } else {
                $areaselect.$input.removeClass('input-disabled');
            }
        }

        /**
         * Get input attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($areaselect[0].attributes, function (i, attr) {
                if (i > 0) {
                    attributes += ",";
                }
                attributes += ('"' + attr.name + '":"' + attr.value + '"');
            });
            attributes += "}";
            return $.parseJSON(attributes);
        }

        function isPlaceHolderSupported() {
            return ('placeholder' in document.createElement('input'));
        }

        /**
         * Main function
         */
        return this.each(function () {
            render();
        });
    };
})(jQuery);