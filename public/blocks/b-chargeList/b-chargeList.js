(function ($) {

    $.widget('role.b-distributionList', {

        options: {
            url: ''
        },

        _create: function () {
            this.$list = this._elem('list');
            this.$addBlock = this._elem('addBlock');
            this._elem('addButton').click(this._proxy(function () {
                this._setMod(this.$addBlock, 'open');
            }));
            this._elem('cancelButton').click(this._proxy(function () {
                this._delMod(this.$addBlock, 'open');
            }));

            this.element.on('click', '.' + this._getElemClass('removeButton'), this._proxy(function (e) {
                this._removeItem(this._getItems().has(e.currentTarget).data('id'));
                e.stopPropagation();
            }));

            this.element.on('b-ajaxform:success', this._proxy(function () {
                this.element.find('form')['b-ajaxForm']('reset');
                this._reload();
            }));
            this._reload();

            this.element.on('click', '.' + this._getElemClass('item'), this._proxy(function (e) {
                var target = $(e.currentTarget);
                e.preventDefault();

                target.toggleClass('active');
            }));
        },

        _reload: function () {
            var _this = this;
            $.get(this.options.url)
                .then(function (resp) {
                    _this.$list.html(resp.data);
                    
                })
                .done();
        },

        _removeItem: function (id) {
            var _this = this;
            $.post(this.options.removeUrl, {id: id})
                .then(function () {
                    _this._reload();
                })
                .done();
        },

        _getItems: function () {
            return this._elem('item');
        },

        getActiveIds: function () {
            var ids = [];
            this._elem('item').filter('.active').each(function () {
                ids.push($(this).data('id'));
            });

            return ids;
        }

    });

})(jQuery)