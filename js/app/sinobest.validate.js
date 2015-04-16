(function ($) {
    $.extend({
        sbvalidate:function (options) {
//            var defaults = {};
//            var settings = $.extend({}, defaults, options || {});

            this.required = function (element, value) {
                if (element.nodeName.toLowerCase() === "select") {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            };
            this.minlength = function (element, value, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return length >= param;
            }
            this.maxlength = function (element, value, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return length < param;
            }

            this.valid = function (regex, value) {
                return new RegExp(regex).test(value);
            };

            this.checkable = function (element) {
                return ( /radio|checkbox/i ).test(element.type);
            };


            this.getLength = function (value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            };
            this.findByName = function (name) {
                return $("input[name='" + name + "']");
            };

            return this;
        }

    });
})(jQuery);