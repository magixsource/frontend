(function ($) {
    $.extend({sbvalidator:{ }});
    $.extend($.sbvalidator, {
        required:function (element, value) {
            if (element.nodeName.toLowerCase() === "select") {
                // could be an array for select-multiple or a string, both are fine this way
                var val = $(element).val();
                return val && val.length > 0;
            }
            if (this.checkable(element)) {
                return this.getLength(value, element) > 0;
            }
            return $.trim(value).length > 0;
        },
        checkable:function (element) {
            return ( /radio|checkbox/i ).test(element.type);
        }, getLength:function (value, element) {
            switch (element.nodeName.toLowerCase()) {
                case "select":
                    return $("option:selected", element).length;
                case "input":
                    if (this.checkable(element)) {
                        return this.findByName(element.name).filter(":checked").length;
                    }
            }
            return value.length;
        }, findByName:function (name) {
            return $("input[name='" + name + "']");
        }, minlength:function (element, value, param) {
            var length = $.isArray(value) ? value.length : this.getLength(value, element);
            return length >= param;
        }, maxlength:function (element, value, param) {
            var length = $.isArray(value) ? value.length : this.getLength(value, element);
            return length < param;
        }, valid:function (regex, value) {
            return regex.test(value);
        }, TEXT_REQUIRED:"\u4e0d\u80fd\u4e3a\u7a7a",
        TEXT_MIN_LENGTH:"\u957f\u5ea6\u4e0d\u80fd\u5c0f\u4e8e",
        TEXT_MAX_LENGTH:"\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e",
        TEXT_REGEX:"\u683c\u5f0f\u4e0d\u6b63\u786e"

    });
})(jQuery);