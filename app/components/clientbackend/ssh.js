const http = require('http');
const nodeSsh = require('node-ssh');
const nginx = require('nginx-conf').NginxConfFile;

const { localNginxConfigPath } = require('../../config/base').base;
const { updateNginxConfig } = require('./nginx');
const { success, error } = require('../../utils/response');

const getServerConfig = server => {
  try {
    const envConfig = process.env[server];
    return JSON.parse(envConfig); // Can be better. Will do for now
  } catch (err) {
    return {};
  }
};

const respondToFileUpdateRequest = isNginxFileUpdated => {
  return isNginxFileUpdated
    ? success('Client IP updated successfully')
    : error('Unable to update nginx file');
};

const updateClientIp = async ({ env, clientLocation }) => {
  try {
    const ssh = new nodeSsh();
    const { host, username, password, nginxPath } = getServerConfig(env);

    if (!host) {
      return error('Unable to fetch environment config');
    }

    const connection = await ssh.connect({
      host,
      username,
      password
    });

    await ssh.getFile(localNginxConfigPath, nginxPath);
    const isNginxFileUpdated = updateNginxConfig(
      localNginxConfigPath,
      clientLocation
    );
    await ssh.putFile(localNginxConfigPath, nginxPath);
    connection.dispose();

    return respondToFileUpdateRequest(isNginxFileUpdated);
  } catch (err) {
    return error(err.message);
  }
};

module.exports = {
  updateClientIp
};
