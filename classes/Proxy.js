const ProxyVerifier = require('proxy-verifier');

const ProxyModel = require('../models/proxy');
const ProxyCheckingHistoryModel = require('../models/proxyCheckingHistory');

const Statuses = {
  NO_AVAILABLE_PROXIES: 'NO_AVAILABLE_PROXIES', // all proxies is use, not available or all are banned
};

class Proxy {
  constructor() {

  }

  /**
   * Get proxy from DB for specified site
   * Which not already in use
   * And not banned on specified site
   * Check proxy for it availability
   * @param siteName {String} - site to check that proxy not banned on it
   * @returns {String}. Available and ready for use proxy
   */
  static async get(siteName) {
    try {
      const findBy = {
        isInUse: false,
        ['banned.' + siteName]: false,
        checkedAt: {$lte: new Date().getTime() - (1 * 60 * 60 * 1000)},
      };

      // get proxy name/port for check and set inUse flag to true while checking
      const proxy = await ProxyModel.findOneAndUpdate(findBy, {isInUse: true});
      if (!proxy) return {success: false, error: Statuses.NO_AVAILABLE_PROXIES};

      // check proxy availability and returns true/false
      const isOnline = await Proxy._checkIfOnline(proxy);
      if(isOnline) return proxy;

      // or get another proxy
      Proxy.get(siteName);
    } catch (err) {

    }
  }

  /**
   * Check proxy for it availability
   * @param address {String}
   * @param port {Number}
   * @returns {Promise} which will returns {boolean}
   * @private
   */
  static async _checkIfOnline({address, port}) {
    try {
      const proxy = {
        ipAddress: address,
        port: port,
        protocol: 'https'
      };

      ProxyVerifier.testAll(proxy, function (error, result) {
        if (error) {
          // Some unusual error occurred.
        } else {
          // insert result into ProxyCheckingHistory

          // The result object will contain success/error information.
          // Sample result:
          // {
          //   anonymityLevel: 'elite',
          //     protocols: {
          //   https: {
          //     ok: true
          //   }
          // },
          //   tunnel: {
          //     ok: true
          //   }
          // }
        }
      });
    } catch (err) {

    }
  }

  /**
   * Add new proxy to DB
   * @param name {String}
   * @param port {Number}
   */
  static add(name, port) {
    // check proxy and insert into DB:
    // Proxy
    // ProxyCheckingHistory
  }
}

