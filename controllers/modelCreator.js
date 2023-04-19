const mongoose = require('mongoose');
const IssuesSchema = require("../controllers/user_schema");
// Function to get a project and export a new model for that project based on the schema from the other file

function createModel(project) {
    //
    const model = mongoose.model(project, IssuesSchema);
    return model;
};

module.exports = createModel;