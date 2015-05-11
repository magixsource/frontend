(function ($) {
    $.extend({
        sbdialog: function (options) {
            var defaults = {
                containerId: null,
                content: null, // 设置content之后，会覆盖container的内容
                url: null, // 页面地址
                className: "sinobest-dialog", //CSS类名
                dialogType: "dialog",
                text: "",
                width: null,
                height: null,
                zIndex: 9999, //影响全局
                title: null,
                okValue: "确定",
                cancelValue: "取消",
                onOK: function () {
                },
                onCancel: null,
                onClose: null,
                button: null// 自定义按钮
            };
            var settings = $.extend({}, defaults, options || {});

            var instance = null;

            this.getValue = function () {
//                if (settings.dialogType == 'modal' || settings.dialogType == 'dialog') {
//                    return $('#' + settings.containerId).html();
//                } else {
//                    return settings.text;
//                }
            };
            this.setValue = function (v) {
//                if (settings.dialogType == 'modal' || settings.dialogType == 'dialog') {
//                    settings.content = v;
//                } else {
//                    settings.text = v;
//                }
//                this.reload();
            };

            this.getState = function () {
                return $.extend({}, getAttributes());
            };

            this.setState = function (stateJson) {
                var ogi = instance.node;

                $.each(stateJson, function (k, v) {
                    $(ogi).attr(k, v);
                });
                return instance;
            };

            this.getDom = function () {
//                if (settings.dialogType == 'modal' || settings.dialogType == 'dialog') {
//                    return document.getElementById(settings.containerId);
//                }
                return instance.node;
            };

            this.reload = function () {
                instance.close();
                render();
            };
            this.display = function (b) {
                if (b) {
                    // open
                    if (!instance.open) {
                        instance.show();
                    }
                } else {
                    instance.close();
                }
            };

            /**
             * 销毁方法
             */
            this.destroy = function () {
                instance.remove();
            };

            function getAttributes() {
                var ogi = instance.node;

                var attributes = "{";
                // DOM attributes
                $.each(ogi.attributes, function (i, attr) {
                    if (i > 0) {
                        attributes += ",";
                    }
                    attributes += ('"' + attr.name + '":"' + attr.value + '"');
                });
                attributes += "}";
                return $.parseJSON(attributes);
            }

            function render() {
                if (settings.dialogType == 'alert') {
                    //$.dialog({content:settings.text});
                    instance = basalDialog({
                        content: settings.text,
                        zIndex: settings.zIndex,
                        width: settings.width,
                        height: settings.height,
                        cancel: false,
                        okValue: settings.okValue,
                        ok: settings.onOK,
                        onclose: settings.onClose
                    });
                    $(instance.node).addClass(settings.className);
                    instance.show();
                } else if (settings.dialogType == 'confirm') {
                    instance = basalDialog({
                        content: settings.text,
                        zIndex: settings.zIndex,
                        width: settings.width,
                        height: settings.height,
                        okValue: settings.okValue,
                        ok: settings.onOK,
                        cancelValue: settings.cancelValue,
                        cancel: settings.onCancel,
                        onclose: settings.onClose
                    });
                    instance.show();
                } else if (settings.dialogType == 'message') {
                    instance = basalDialog({
                        zIndex: settings.zIndex,
                        content: settings.text,
                        width: settings.width,
                        height: settings.height,
                        onclose: settings.onClose
                    });
                    $(instance.node).addClass(settings.className);
                    instance.show();
                    if (settings.autoClose) {
                        setTimeout(function () {
                            instance.close().remove();
                        }, settings.autoClose * 1000);
                    }

                } else if (settings.dialogType == 'modal') {
                    var json = {
                        title: settings.title,
                        zIndex: settings.zIndex,
                        width: settings.width,
                        height: settings.height,
                        button: settings.button,
                        onclose: settings.onClose
                    };
                    // 判断是否iframe弹出
                    if (settings.url) {
                        json = $.extend({}, json, {url: settings.url});
                    } else {
                        var content = null;
                        // 是否自定义弹出内容
                        if (settings.content) {
                            content = settings.content;
                        } else {
                            // DOM容器
                            content = $("#" + settings.containerId).html();
                        }
                        json = $.extend({}, json, {content: content});
                    }

                    instance = basalDialog(json);
                    $(instance.node).addClass(settings.className);
                    instance.showModal();
                } else {
                    // handle as dialog
                    var json = {
                        title: settings.title,
                        zIndex: settings.zIndex,
                        width: settings.width,
                        height: settings.height,
                        button: settings.button,
                        onclose: settings.onClose
                    };
                    if (settings.url) {
                        json = $.extend({}, json, {url: settings.url});
                    } else {
                        var content = null;
                        if (settings.content) {
                            content = settings.content;
                        } else {
                            content = $("#" + settings.containerId).html();
                        }
                        json = $.extend({}, json, {content: content});
                    }

                    instance = basalDialog(json);
                    $(instance.node).addClass(settings.className);
                    instance.show();
                }
            }

            render();
            return this;
        }

    });
})(jQuery);