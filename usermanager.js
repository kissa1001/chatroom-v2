var _ = require('underscore');

var UserManager = function(){
  this.users = [];
};

UserManager.prototype.addUser = function(name, socket) {
  if (_.findWhere(this.users, {userName: name})) {
    return false;
  } else {
    socket.userName = name;
    this.users.push(socket);
    console.log('User ' + name + ' successfully added.');
    return socket;
  }
};

UserManager.prototype.getUser = function(name) {
  return _.findWhere(this.users, {userName: name});
};

UserManager.prototype.removeUser = function(socket) {
  var name = socket.userName;
  this.users = _.reject(this.users, function(user) { return user.userName == name; });
  console.log(name + ' disconnected');
};

UserManager.prototype.getNames = function() {
  return this.users.map(function(user){ return user.userName; });
};

module.exports = UserManager;
