var m = require('underscore').memoize;


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

    
    paymentService: function (deviceId, userAgent) {
        return require('./services/payments');
    }

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