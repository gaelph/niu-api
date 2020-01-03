const { Gstore, instances } = require('gstore-node');
const { Datastore } = require('@google-cloud/datastore');

const INSTANCE_ID = 'nezh-datastore';

module.exports.init = function init(projectId) {
  const gstore = new Gstore();
  const namespace = process.env.NODE_ENV === 'test' ? 'test' : undefined;
  const datastore = new Datastore({
      projectId: projectId,
      namespace
  });
  
  gstore.connect(datastore);
  
  // Save the gstore instance
  instances.set(INSTANCE_ID, gstore);
}

module.exports.getInstance = function getInstance() {
  return instances.get(INSTANCE_ID)
}

