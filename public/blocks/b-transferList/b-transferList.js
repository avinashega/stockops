(function ($) {

    $.widget('role.b-transferList', {

        options: {
            url: ''
        },

        _create: function () {
            this.$list = this._elem('list');
            this.element.on('b-ajaxform:success', this._proxy(function () {
                this.element.find('form')['b-ajaxForm']('reset');
            }));
            this._reload();
        },

        _reload: function () {
            var _this = this;
            $.get(this.options.url)
                .then(function (resp) {
                    _this.$list.html(resp.data);
                })
                .done();
        }

    });

})(jQuery)