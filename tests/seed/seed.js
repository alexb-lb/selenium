/** Created by alex on 13.07.2017 **/
'use strict';
const {ObjectId} = require('mongodb');

const Proxy = require('../../models/proxy');

const proxyOneId = new ObjectId();
const proxyTwoId = new ObjectId();
const proxyThreeId = new ObjectId();

const proxies = [

  // proxies[0]
  {
    _id: proxyOneId,
    address: '1.1.1.1',
    port: 8000,
  },

  // proxies[1]
  {
    _id: proxyTwoId,
    address: '2.2.2.2',
    port: 8000,
    isInUse: true
  },

  // proxies[2]
  {
    _id: proxyThreeId,
    address: '3.3.3.3',
    port: 8000,
    banned: { twitch: true },
  },
];

const populateProxies = async () => {
  await Proxy.remove({});
  await new Proxy(proxies[0]).save();
  await new Proxy(proxies[1]).save();
  await new Proxy(proxies[2]).save();
};


module.exports = {proxies, populateProxies};