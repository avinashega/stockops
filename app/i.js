var m = require('underscore').memoize;

function _formatErrors(errors) {
    if (typeof errors === 'string') {
        return errors;
    } else if (errors instanceof Error) {
        return 'System error';
    } else {
        var result = {};
        errors.forEach(function (e) {
            result[e.param] = e.msg;
        });
        return result;
    }
}

module.exports = {

    /**
     * @return {SkinDb}
     */
    db: m(function () {
        return require('./bootstraps/mongoskin');
    }),

    /**
     *
     * @returns {agenda}
     */
    agenda: function () {
        return require('./bootstraps/agenda');
    },

    
    paymentService: function () {
        return require('./services/payment');
    },
    
    chargeService: function () {
        return require('./services/charges');
    },
    
    recipientService: function () {
        return require('./services/recipients');
    },
    
    transferService: function () {
        return require('./services/transfers');
    },

    
    jsonResponse: {
        data: function (data) {
            return {
                status: 'ok',
                data: data
            }
        },
        error: function (message) {
            return {
                status: 'error',
                message: _formatErrors(message)
            };
        },
        redirect: function (url) {
            return {
                status: 'redirect',
                url: url
            };
        }
    }
};