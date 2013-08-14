//'use strict';

var expect = require('chai').expect;
var ChefCommand = require('../lib/chef-command');

describe('ChefCommand', function() {

  it('should add a cookbookPath correctly', function(done) {

    var chefCmd = new ChefCommand({ cookbook_path: [ '/tmp/cookbooks'] });
    chefCmd.addCookbookPath('/tmp/site-cookbooks');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).to.contain.string('site-cookbooks');
    done();
  });

  it('should remove a cookbookPath correctly', function(done) {

    var chefCmd = new ChefCommand({ cookbook_path: [ '/tmp/cookbooks'] });
    chefCmd.removeCookbookPath('/tmp/cookbooks');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).to.not.contain.string('/tmp/cookbook');
    done();
  });

  it('should set debug level correctly', function(done) {

    var chefCmd = new ChefCommand({ log_level: 'info' });
    chefCmd.setLogLevel('debug');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).to.contain.string('debug');
    expect(cmd.command).to.contain.string('debug');
    done();
  });

  it('should set dataBagPath only if specified', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.setLogLevel('debug');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).not.to.contain.string('data_bag_path');
    chefCmd.addDataBagPath('/tmp/databags');
    cmd = chefCmd.generate();
    expect(cmd.config_rb).to.contain.string('databags');
    done();
  });

  it('should set rolePath only if specified', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.setLogLevel('debug');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).not.to.contain.string('role_path');
    chefCmd.addRolePath('/tmp/roles');
    cmd = chefCmd.generate();
    expect(cmd.config_rb).to.contain.string('/tmp/roles');
    done();
  });

  it('should set environmentPath only if specified', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.setLogLevel('debug');

    var cmd = chefCmd.generate();
    expect(cmd.config_rb).not.to.contain.string('environment_path');
    chefCmd.addEnvironmentPath('/tmp/path1');
    chefCmd.addEnvironmentPath('/tmp/path2');
    cmd = chefCmd.generate();
    expect(cmd.config_rb).to.contain.string('/tmp/path1');
    expect(cmd.config_rb).to.contain.string('/tmp/path2');
    done();
  });

  it('should add a recipe if specified', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.addRecipe('logstash::server');
    var cmd = chefCmd.generate();

    expect(cmd.dna_json).to.contain.string('logstash::server');
    done();
  });

  it('should remove a recipe an existing recipe', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.addRecipe('logstash::server');
    chefCmd.removeRecipe('logstash::server');
    var cmd = chefCmd.generate();

    expect(cmd.dna_json).to.not.contain.string('logstash::server');
    done();
  });

  it('should add a role if specified', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.addRole('database::server');
    var cmd = chefCmd.generate();

    expect(cmd.dna_json).to.contain.string('database::server');
    done();
  });

  it('should remove a role an existing role', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.addRole('database::server');
    chefCmd.removeRole('database::server');
    var cmd = chefCmd.generate();

    expect(cmd.dna_json).to.not.contain.string('database::server');
    done();
  });

  it('should merge the extra json', function(done) {

    var chefCmd = new ChefCommand();
    chefCmd.setExtraJson({ nodename: 'mymachine' });
    var cmd = chefCmd.generate();

    console.log(cmd);
    expect(cmd.dna_json).to.contain.string('mymachine');
    done();
  });

});
