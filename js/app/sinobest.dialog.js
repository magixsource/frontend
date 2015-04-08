(function ($) {
    $.extend({
        sbdialog:function (options) {
            var defaults = {
                containerId:null,
                content:null, // 设置content之后，会覆盖container的内容
                className:"sinobest-dialog", //CSS类名(Unuse)
                dialogType:"dialog",
                text:"",
                width:null, //(Unuse)
                height:null, //(Unuse)
                zIndex:1024, //影响全局
                title:null, //(Unuse)
                // 自定义按钮
                okValue:"确定",
                cancelValue:"取消",
                onClick:function () {
                },
                onCancel:null,
                button:null
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
                return $.extend({}, getAttributes(), getSettings());
            };

            this.setState = function (stateJson) {

            };

            this.getDom = function () {
                if (settings.dialogType == 'modal' || settings.dialogType == 'dialog') {
                    return document.getElementById(settings.containerId);
                }
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

            this.destory = function () {
                instance.remove();
            };

            function getAttributes() {

            }

            function getSettings() {
                return settings;
            }

            function render() {
                if (settings.dialogType == 'alert') {
                    //$.dialog({content:settings.text});
                    instance = dialog({
                        content:settings.text,
                        cancel:false,
                        okValue:settings.okValue,
                        ok:settings.onClick
                    });
                    instance.show();
                } else if (settings.dialogType == 'confirm') {
                    instance = dialog({
                        content:settings.text,
                        okValue:settings.okValue,
                        ok:settings.onClick,
                        cancelValue:settings.cancelValue,
                        cancel:settings.onCancel
                    });
                    instance.show();
                } else if (settings.dialogType == 'message') {
                    instance = dialog({
                        content:settings.text
                    });
                    instance.show();
                    if (settings.autoClose) {
                        setTimeout(function () {
                            instance.close().remove();
                        }, settings.autoClose * 1000);
                    }

                } else if (settings.dialogType == 'modal') {
                    var content = null;
                    if (settings.content) {
                        content = settings.content;
                    } else {
                        content = $("#" + settings.containerId).html();
                    }

                    instance = dialog({
                        title:settings.title,
                        content:content,
                        button:settings.button
                    });
                    instance.showModal();
                } else {
                    // handle as dialog
                    var content = null;
                    if (settings.content) {
                        content = settings.content;
                    } else {
                        content = $("#" + settings.containerId).html();
                    }

                    instance = dialog({
                        title:settings.title,
                        content:content,
                        button:settings.button
                    });
                    instance.show();
                }
            }

            render();
            return this;
        }

    });
})(jQuery);