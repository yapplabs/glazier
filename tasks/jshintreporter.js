module.exports = {
  reporter: function (errors) {
    if (errors.length)
    {
      var growl = require('growl');
      for (var i = 0; i < errors.length; i++)
      {
        // parses all that directory junk before file
        var slashindex = errors[i].file.lastIndexOf('/');

        // logs in console with same format as if there was no reporter
        console.log(errors[i].file + ": line " + errors[i].error.line + ", col" + errors[i].error.character + ", " + errors[i].error.raw);
        
        if (slashindex == -1)
        {
          growl(errors[i].error.evidence + " @ line: " + errors[i].error.line, {title: errors[i].file + ": " + errors[i].error.raw});
        }
        else
        {
          growl(errors[i].error.evidence + " @ line: " + errors[i].error.line, {title: errors[i].file.substr(slashindex, errors[i].file.length) + ": " + errors[i].error.raw});
        }
      }
          console.log("\n" + errors.length + " errors");
    }
  }
};