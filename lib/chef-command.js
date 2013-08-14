'use strict';

var hashmerge = require('hashmerge');

var ChefCommand = function(options) {

  var self = this;

  var defaults = {
    executable: 'chef-solo',
    log_level: 'info',

    run_list: [],

    cookbook_path: [],
    role_path: null,
    environment_path: null,
    data_bag_path: null,

    dna_json_path: '/tmp/dna.json',
    config_rb_path: '/tmp/solo.rb',

    file_cache_path: '/var/chef-solo',

    extra_json: null

  };

  self.settings = hashmerge(defaults, options);

  return self;
};

module.exports = ChefCommand;

ChefCommand.prototype.command = function() {
  var self = this;
  var settings = self.settings;

  var commands = [
    settings.executable,
    '-c', settings.config_rb_path,
    '-j', settings.dna_json_path,
    '-l', settings.log_level
  ];

  return commands.join(' ');
};

ChefCommand.prototype.addRecipe = function(recipe) {
  var self = this;

  if (self.settings.cookbook_path.indexOf(recipe) < 0) {
    self.settings.run_list.push('recipe['+recipe+']');
  }

  return self;
};

ChefCommand.prototype.removeRecipe = function(recipe) {
  var self = this;
  var matchLocation = self.settings.run_list.indexOf('recipe['+recipe+']');
  if (matchLocation === 0) {
    self.settings.run_list.splice(matchLocation, 1);
  }
  return self;
};

ChefCommand.prototype.removeRole = function(role) {
  var self = this;
  var matchLocation = self.settings.run_list.indexOf('role['+role+']');
  if (matchLocation === 0) {
    self.settings.run_list.splice(matchLocation, 1);
  }
  return self;
};

ChefCommand.prototype.addRole = function(role) {
  var self = this;

  if (self.settings.cookbook_path.indexOf(role) < 0) {
    self.settings.run_list.push('role['+role+']');
  }

  return self;
};

ChefCommand.prototype.setLogLevel = function(level) {
  var self = this;

  self.settings.log_level = level;

  return self;
};

ChefCommand.prototype.setExecutable = function(executable) {
  var self = this;

  self.settings.executable = executable;

  return self;
};

ChefCommand.prototype.setRunList = function(list) {
  var self = this;

  self.settings.run_list = list;

  return self;
};

ChefCommand.prototype.addCookbookPath = function(path) {
  var self = this;
  if (self.settings.cookbook_path.indexOf(path) < 0) {
    self.settings.cookbook_path.push(path);
  }
  return self;
};

ChefCommand.prototype.removeCookbookPath = function(path) {
  var self = this;
  var matchLocation = self.settings.cookbook_path.indexOf(path);
  if (matchLocation === 0) {
    self.settings.cookbook_path.splice(matchLocation, 1);
  }
  return self;
};

ChefCommand.prototype.addDataBagPath = function(path) {
  var self = this;
  if (self.settings.data_bag_path) {
    if (self.settings.data_bag_path.indexOf(path) < 0) {
      self.settings.data_bag_path.push(path);
    }
  } else {
      self.settings.data_bag_path = [ path ];
  }
  return self;
};

ChefCommand.prototype.removeDataBagPath = function(path) {
  var self = this;
  if (self.settings.data_bag_path) {
    var matchLocation = self.settings.data_bag_path.indexOf(path);
    if (matchLocation === 0) {
      self.settings.data_bag_path.splice(matchLocation, 1);
    }
  }
  return self;
};

ChefCommand.prototype.addRolePath = function(path) {
  var self = this;
  if (self.settings.role_path) {
    if (self.settings.role_path.indexOf(path) < 0) {
      self.settings.role_path.push(path);
    }
  } else {
      self.settings.role_path = [ path ];
  }
  return self;
};

ChefCommand.prototype.removeRolePath = function(path) {
  var self = this;
  if (self.settings.role_path) {
    var matchLocation = self.settings.role_path.indexOf(path);
    if (matchLocation === 0) {
      self.settings.role_path.splice(matchLocation, 1);
    }
  }
  return self;
};

ChefCommand.prototype.addEnvironmentPath = function(path) {
  var self = this;
  if (self.settings.environment_path) {
    if (self.settings.environment_path.indexOf(path) < 0) {
      self.settings.environment_path.push(path);
    }
  } else {
      self.settings.environment_path = [ path ];
  }

  return self;
};

ChefCommand.prototype.removeEnvironmentPath = function(path) {
  var self = this;
  if (self.settings.environment_path) {
    var matchLocation = self.settings.environment_path.indexOf(path);
    if (matchLocation === 0) {
      self.settings.environment_path.splice(matchLocation, 1);
    }
  }
  return self;
};

ChefCommand.prototype.setExtraJson = function(json) {
  var self = this;
  self.settings.extra_json = json;
  return self;
};

ChefCommand.prototype.dna_json = function() {
  var self = this;

  var run_list = { run_list: self.settings.run_list };

  var extra_json = {};
  if (self.settings.extra_json) {
    extra_json = self.settings.extra_json;
  }

  var result = hashmerge(run_list, extra_json);

  var dna_json = JSON.stringify(result);

  return  dna_json;
};

ChefCommand.prototype.config_rb = function() {

  var self = this;

  var config_rb_options = [
    [ 'role_path', self.settings.role_path ],
    [ 'data_bag_path', self.settings.data_bag_path ],
    [ 'environment_path', self.settings.environment_path ],
    [ 'file_cache_path', self.settings.file_cache_path ],
    [ 'log_level' , self.settings.log_level ],
    [ 'cookbook_path', self.settings.cookbook_path ]
  ];

  var config_rb = [];

  config_rb_options.forEach(function(option) {
    var line;
    var key = option[0];
    var value = option[1];

    if (value === undefined) {
      return;
    }

    // For simple string arguments
    if (typeof value === 'string') {
      line = key + ' "' + value + '"';
      config_rb.push(line);
    }

    // For array arguments
    if (value instanceof Array && value.length > 0) {
      line = key + ' [ "' + value.join('" , "') + '" ]';
      config_rb.push(line);
    }
  });

  return config_rb.join('\n');
};

ChefCommand.prototype.generate = function() {
  var self = this;
  return {
    'config_rb': self.config_rb(),
    'dna_json': self.dna_json(),
    'command': self.command()
  };
};
