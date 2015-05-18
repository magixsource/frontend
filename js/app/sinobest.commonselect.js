/**
 * Sinobest-Commonselect
 */
(function ($) {
    var defaults = {
        className: "sinobest-commonselect", //CSS类名
        required: false, // 是否必录
        placeholder: null,
        disabled: null,
        readonly: false,
        callback: null,
        data: null,// 一次性完全数据
        url: null,// ajax异步请求数据
        value: ""
    };

    $.fn.sbcommonselect = function (options) {
        var settings = $.extend({}, defaults, options || {});
        var $commonselect = this;
        $commonselect.settings = settings;

        /**
         * Get text value
         * @return  object
         */
        $commonselect.getValue = function () {
            return $commonselect.$input.val();
        };

        /**
         * Set text value
         * @param value new value
         * @return object
         */
        $commonselect.setValue = function (value) {
            return $commonselect.$input.val(value);
        };
        /**
         * Get text state
         * @return object
         */
        $commonselect.getState = function () {
            return $.extend({}, getAttributes());
        };

        /**
         * Set text new state
         * @param stateJson state json
         * @return  object
         */
        $commonselect.setState = function (stateJson) {
            $.each(stateJson, function (k, v) {
                if (v) {
                    if (k == 'value') {
                        $commonselect.setValue(v);
                    } else if (k == 'required') {
                        $commonselect.settings.required = v;
                        $commonselect.$input.attr('required', $commonselect.settings.required);
                    } else if (k == 'readonly') {
                        $commonselect.settings.readonly = v;
                        $commonselect.$input.attr('readonly', $commonselect.settings.readonly);
                    } else if (k == 'disabled') {
                        $commonselect.settings.disabled = v;
                        $commonselect.$input.attr('disabled', $commonselect.settings.disabled);
                        if (v) {
                            toggleDisabledClass(true);
                        } else {
                            toggleDisabledClass(false);
                        }
                    } else {
                        $commonselect.attr(k, v);
                    }
                } else {
                    $commonselect.removeAttr(k);
                }
            });
            return $commonselect;
        };

        /**
         * Get HTML DOM
         * @return DOM object
         */
        $commonselect.getDom = function () {
            return $commonselect[0];
        };

        /**
         * Reload text
         * @return object
         */
        $commonselect.reload = function () {
            return render();
        };
        /**
         * Text show or hide
         * @param show show or hide
         * @return object
         */
        $commonselect.display = function (show) {
            if (show) {
                $commonselect.show();
            } else {
                $commonselect.hide();
            }
            return $commonselect;
        };
        /**
         * Destroy text
         */
        $commonselect.destroy = function () {
            return $commonselect.remove();
        };

        /**
         * Validate input
         */
        $commonselect.validate = function () {
            var isFunc = $.isFunction(settings.callback);
            if (isFunc) {
                return settings.callback();
            } else {
                // basic validate
                var v = $commonselect.getValue();

                var isOk = false;
                if (settings.required) {
                    isOk = $.sbvalidator.required($commonselect.$input[0], v);
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
            $commonselect.$input = $('<input type="text" class="commonselect-input">');
            //$areaselect.$input.wrapAll('<span></span>')
            $commonselect.append($commonselect.$input);
        }

        /**
         * Init
         */
        function render() {
            $commonselect.addClass($commonselect.settings.className);
            buildInput();
            if ($commonselect.settings.required) {
                $commonselect.$input.attr('required', $commonselect.settings.required);
            }
            if ($commonselect.settings.placeholder) {
                $commonselect.$input.attr('placeholder', $commonselect.settings.placeholder);
                // 测试是否支持
                if (!isPlaceHolderSupported()) {
                    $commonselect.$input.placeholder();
                }
            }
            if ($commonselect.settings.readonly) {
                $commonselect.$input.attr('readonly', 'readonly');
            }
            if ($commonselect.settings.disabled) {
                $commonselect.$input.attr('disabled', 'disabled');
                toggleDisabledClass(true);
            }
            if ($commonselect.settings.value) {
                $commonselect.$input.val($commonselect.settings.value);
            }

            // event listener
            $commonselect.$input.on('click', function () {
                // build or not
                if (!$commonselect.isBuilded) {
                    buildDropdown();
                    $commonselect.isBuilded = true;
                    afterBuildDropdown();
                }
                //showDropdown();
                $commonselect.$dropdown.show();
            });

            return $commonselect;
        }


        function afterBuildDropdown() {
            // 事件监听之类的
            $commonselect.find('.commonselect-dropdown-content > .dropdown-content-item').hover(function () {
                var eq = $commonselect.find('.commonselect-dropdown-content > .dropdown-content-item').index(this),				//获取当前滑过是第几个元素
                    h = $commonselect.find('.commonselect-dropdown-content').offset().top,						//获取当前下拉菜单距离窗口多少像素
                    s = $(window).scrollTop(),									//获取游览器滚动了多少高度
                    i = $(this).offset().top,									//当前元素滑过距离窗口多少像素
                    item = $(this).children('.dropdown-content-item-list').height(),				//下拉菜单子类内容容器的高度
                    sort = $commonselect.find('.commonselect-dropdown-content').height();						//父类分类列表容器的高度

                if (item < sort) {												//如果子类的高度小于父类的高度
                    if (eq == 0) {
                        $(this).children('.dropdown-content-item-list').css('top', (i - h));
                    } else {
                        $(this).children('.dropdown-content-item-list').css('top', (i - h) + 1);
                    }
                } else {
                    if (s > h) {												//判断子类的显示位置，如果滚动的高度大于所有分类列表容器的高度
                        if (i - s > 0) {											//则 继续判断当前滑过容器的位置 是否有一半超出窗口一半在窗口内显示的Bug,
                            $(this).children('.dropdown-content-item-list').css('top', (s - h) + 2);
                        } else {
                            $(this).children('.dropdown-content-item-list').css('top', (s - h) - (-(i - s)) + 2);
                        }
                    } else {
                        $(this).children('.dropdown-content-item-list').css('top', 3);
                    }
                }

                $(this).addClass('hover');
                $(this).children('.dropdown-content-item-list').css('display', 'block');
                $commonselect.$dropdown.show();
            }, function (e) {
                $(this).removeClass('hover');
                $(this).children('.dropdown-content-item-list').css('display', 'none');
                $commonselect.$dropdown.hide();
            });

            // select
            $commonselect.find(".dropdown-content-subitem a").off("click").on("click", function () {
                $(this).toggleClass("selected");

                var text = $(this).text();
                var value = $commonselect.getValue();
                if ($(this).hasClass('selected')) {
                    if (value.length > 0) {
                        value += "," + text;
                    } else {
                        value = text;
                    }
                } else {
                    var str = '';
                    if (value.indexOf(text + ",") != -1) {
                        str = text + ',';
                    } else if (value.indexOf(',' + text) != -1) {
                        str = ',' + text;
                    } else {
                        str = text;
                    }
                    value = value.replace(str, '');
                }
                $commonselect.setValue(value);
                //$commonselect.$dropdown.hide();
            });

            // close handle
            $commonselect.find('.dropdown-content-item > .dropdown-content-item-list > .dropdown-content-item-close').click(function () {
                $(this).parent().parent().removeClass('hover');
                $(this).parent().hide();
            });


        }


        /**
         * Get level data,Should support ajax lazy data and already load data
         * @param level
         */
        function getDataByParent(pid) {
            var array = new Array();
            if ($commonselect.settings.ajaxMode) {
                // Yep,ajax mode
            } else {
                $.each($commonselect.settings.data, function () {
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
            $commonselect.$dropdown = $('<span class="commonselect-dropdown"></span>');
            $commonselect.$dropdownContent = $('<div class="commonselect-dropdown-content"></div>');

            // build item
            var firstLevelData = getDataByParent($commonselect.settings.rootId);
            var html = buildLevel(1, firstLevelData);

            $commonselect.$dropdownContent.append(html);
            // final
            $commonselect.$dropdown.append($commonselect.$dropdownContent);
            $commonselect.append($commonselect.$dropdown);
        }

        /**
         * Build diffirent level construction
         * @param level
         */
        function buildLevel(level, array) {
            level = parseInt(level);
            var html = "";
            if (level == 1) {
                $.each(array, function (idx) {
                    html += '<div class="dropdown-content-item"><h3><span>·</span>';
                    var item = $(this).attr('item');
                    if (item) {
                        html += '<a href="###">' + $(item).attr('detail') + '</a>';
                    } else {
                        // items
                        var items = $(this).attr('items');
                        $.each(items, function (idx) {
                            if (idx > 0) {
                                html += '、';
                            }
                            html += '<a href="###">' + $(this).attr('detail') + '</a>';
                        });
                    }
                    html += '</h3></div>';
                    var children = getDataByParent($(this).attr('id'));
                    var childrenHtml = "";
                    if (children && children.length > 0) {
                        childrenHtml += buildLevel(level + 1, children);
                    }
                    if (childrenHtml.length > 0) {
                        var $html = $(html);
                        $html.find('h3').eq(idx).after(childrenHtml);
                        html = $("<div></div>").append($html.clone()).html();
                    }
                });

            } else if (level == 2) {
                html += '<div class="clearfix dropdown-content-item-list">' +
                        //'<div class="dropdown-content-item-close">x</div>'+
                    '<div class="dropdown-content-subitem">';
                var tempHtml = "";
                $.each(array, function () {
                    var item = $(this).attr('item');
                    tempHtml += '<dl id="' + $(this).attr('id') + '"><dt><a href="###">' + $(item).attr('detail') + '</a></dt></dl>';

                    var children = getDataByParent($(this).attr('id'));
                    var childrenHtml = "";
                    if (children && children.length > 0) {
                        childrenHtml += buildLevel(level + 1, children);
                    }
                    if (childrenHtml.length > 0) {
                        var $tempHtml = $(tempHtml);
                        $tempHtml.append(childrenHtml);
                        tempHtml = $("<div></div>").append($tempHtml.clone()).html();
                    }
                });
                html += tempHtml;
                // 有可能加上右边自定义文本之类的使用dropdown-content-cat-right
                html += '</div></div>';
            } else if (level == 3) {
                html += "<dd>";
                $.each(array, function () {
                    var $item = $(this).attr('item');
                    html += '<em><a href="#">' + $($item).attr('detail') + '</a></em>';
                });
                html += "</dd>";
            } else {
                // unsupported operation
                throw  "仅支持3层数据 <- Unsupported operation"
            }

            return html;
        }


        /**
         * enabled or disabled class
         */
        function toggleDisabledClass(flag) {
            if (flag) {
                $commonselect.$input.addClass('input-disabled');
            } else {
                $commonselect.$input.removeClass('input-disabled');
            }
        }

        /**
         * Get input attributes
         */
        function getAttributes() {
            var attributes = "{";
            // DOM attributes
            $.each($commonselect[0].attributes, function (i, attr) {
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