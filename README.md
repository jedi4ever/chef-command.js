# Description

This generates both the correct [Opscode chef](http://opscode.com/chef) command the corresponding json file to use.

Documentation on Chef-Solo options:
- <http://docs.opscode.com/chef_solo.html>
- <http://docs.opscode.com/ctl_chef_solo.html>
- <http://docs.opscode.com/config_rb_solo.html>

Documentation on Chef-Client options:
- <http://docs.opscode.com/chef_client.html>
- <http://docs.opscode.com/config_rb_client.html>

# API
## Constructor

    var ChefCommand = require('chef-command');
    var chefCmd = new ChefCommand();

options:
- `executable`: defaults to chef-solo
- `file_cache_path`:
- `dna_json_path`:
- `role_path`:
- `environment_path`:
- `data_bag_path`:
- `config_rb_path`:
- `log_level`:
- `cookbook_path`:
- `run_list`:
- `extra_json`: // extra json to merge in the dna.json

## Instance variables

- settings : a hash containing all settings

## Instance methods
    var ChefCommand = require('chef-command');
    var chefCmd = new ChefCommand();
    chefCmd.addCookbookPath('/tmp/cookbooks'); // add a cookbook
    chefCmd.addCookbookPath('/tmp/site-cookbooks').logLevel('debug'); // example of chainable

- `addCookbookPath(path)` : adds a CookbookPath +  returns chainable self
- `removeCookbookPath(path)` : removes a CookbookPath + returns chainable self
- `addRolePath(path)` : adds a RolePath +  returns chainable self
- `removeRolePath(path)` : removes a RolePath + returns chainable self
- `addDataBagPath(path)` : adds a DataBagPath +  returns chainable self
- `removeDataBagPath(path)` : removes a DataBagPath + returns chainable self
- `setExecutable(command)` : sets the executable command to command
- `setLogLevel(level)` : sets the LogLevel + returns chainable self
- `addRecipe(recipe)` : adds recipe to the runlist
- `addRole(role)` : adds role to the run runlist
- `setRunList(array of runlist)` : sets the runlist
- `setExtraJson(json)` : json to merge with dna.json
- `removeRole(role)`: removes the role from the runlist
- `removeRecipe(recipe)`: removes the recipe to the runlist

## Getters
- generate() : return hash containing 

- `dna_json`: **string** containing the dna.json to use
- `config_rb`: **string** containing the config.rb
- `command`: **string** containing the actual CLI invocation

    var ChefCommand = require('chef-command');
    var chefCmd = new ChefCommand();
    chefCmd.addCookbookPath('/tmp/cookbooks'); // add a cookbook
    chefCmd.generate();
