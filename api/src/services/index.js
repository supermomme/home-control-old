const gadget = require('./gadget/gadget.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(gadget)
}
