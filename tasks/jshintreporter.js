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
        console.log("FILE:  " + errors[i].file + " -- scope: " + errors[i].error.scope);
        console.log("     line " + errors[i].error.line + ", col" + errors[i].error.character + ", " + errors[i].error.reason);
        console.log("     " + errors[i].error.evidence);

        if (slashindex == -1)
        {
          growl(errors[i].error.reason, {title: "line: " + errors[i].error.line + " @ " + errors[i].file});
        }
        else
        {
          growl(errors[i].error.reason, {title: "line: " + errors[i].error.line + " @ " + errors[i].file.substr(slashindex, errors[i].file.length)});
        }
      }
          console.log("\n" + errors.length + " errors");
    }
  }
};