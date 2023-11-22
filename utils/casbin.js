const path = require('path');
const { newEnforcer } = require('casbin');
const { MongooseAdapter } = require('casbin-mongoose-adapter');
const config = require('../config/globalConfig');
const { RedisWatcher } = require('@casbin/redis-watcher');

exports.newEnforcer = async () => {
  const watcher = await RedisWatcher.newWatcher(
    `${config.REDIS_URL}:${config.REDIS_PORT}`
  );
  const model = path.resolve(__dirname, '..', 'casbin', 'model.conf');
  const DB = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`;
  const adapter = await MongooseAdapter.newAdapter(DB);
  const enforcer = await newEnforcer(model, adapter);
  enforcer.setWatcher(watcher);
  return enforcer;
};
