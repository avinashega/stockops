(function ($) {

    $.widget('role.b-chargeList', {

        options: {
            url: ''
        },

        _create: function () {
            this.$list = this._elem('list');
            this.$popup = this._elem('popup');
            var submit = this._elem('modalCapture');
            this._elem('modalCapture').click(this._proxy(function () {
                var data = {
                    id: this._elem('modalId').val()
                };
                var _this = this;
                submit.button('loading');
                $.post(this.options.captureUrl, data)
                    .always(function (res) {
                        submit.button('reset');
                        if (res.status == 'ok') {
                        	_this._delMod('error');
                            _this._setMod('success');
                            _this._elem('successMessage').text(res.data);
                        } else {
                        	_this._delMod('success');
                        	_this._setMod('error');
                            if (typeof res.message == 'string') {
                                _this._elem('errorMessage').text(res.message);
                            } else {
                                for (var key in res.message) {
                                    _this._elem('errorMessage').text(res.message[key]);
                                }
                            }
                        }
                    })
                    .then(this._proxy(function () {
                    	this._reload();
                        this.$popup.modal('hide');
                    }))
                    .done;                
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
            
            this.element.on('click', '.' + this._getElemClass('capture'), this._proxy(function (e) {
                var target = this._elem('item').has($(e.currentTarget));
                this._showPopup(target.data('id'));
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
        
        _showPopup: function (id) {
            this._elem('modalId').val(id);
            this.$popup.modal('show');
        }

    });

})(jQuery)