const nginx = require('nginx-conf').NginxConfFile;

const updateNginxConfig = (file, address) => {
  try {
    nginx.create(file, (err, conf) => {
      const locations = conf.nginx.http.server.location;
      for (let i = 0; i < locations.length; i++) {
        // simple for loop will do the trick
        if (locations[i]._value === '/clientbackend/') {
          //Specific requirement
          locations[i].proxy_pass._value = address;
          break;
        }
      }
    });
    return true; // Taking an assumption here that if the program reaches here, it has done its job
  } catch (err) {
    return false;
  }
};

module.exports = {
  updateNginxConfig
};
