(function ($) {
    $.extend({
        sbdialog:function (options) {
            var defaults = {
                containerId:null,
                className:"sinobest-dialog", //CSS类名
                dialogType:"dialog",
                text:"",
                onClick:function () {
                },
                onCancel:null
            };
            var settings = $.extend({}, defaults, options || {});

            function render() {
                if (settings.dialogType == 'alert') {
                    //$.dialog({content:settings.text});
                    var d = dialog({
                        content:settings.text,
                        cancel:false,
                        okValue:'确定',
                        ok:settings.onClick
                    });
                    d.show();
                } else if (settings.dialogType == 'confirm') {
                    var d = dialog({
                        content:settings.text,
                        okValue:'确定',
                        ok:settings.onClick,
                        cancelValue:'取消',
                        cancel:settings.onCancel
                    });
                    d.show();
                } else if (settings.dialogType == 'message') {
                    var d = dialog({
                        content:settings.text
                    });
                    d.show();
                    if (settings.autoClose) {
                        setTimeout(function () {
                            d.close().remove();
                        }, settings.autoClose * 1000);
                    }

                } else if (settings.dialogType == 'modal') {
                    var d = dialog({
                        title:'模态窗',
                        width:400,
                        content:$("#" + settings.containerId).html()
                    });
                    d.showModal();
                } else {
                    // handle as dialog
                    var d = dialog({
                        title:'对话框',
                        width:400,
                        content:$("#" + settings.containerId).html()
                    });
                    d.show();
                }
            }

            render();
            return this;
        }

    });
})(jQuery);

