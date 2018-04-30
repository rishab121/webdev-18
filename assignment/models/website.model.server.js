var mongoose = require("mongoose");
var websiteSchema = require("./website.schema.server");
var websiteModel = mongoose.model("WebsiteModel", websiteSchema);
var userModel = require("./user.model.server");

websiteModel.createWebsite = createWebsite;
websiteModel.findWebsitesForUser = findWebsitesForUser;
websiteModel.findWebsiteById = findWebsiteById;
websiteModel.deleteWebsite = deleteWebsite;

module.exports = websiteModel;

function deleteWebsite(developerId, websiteId) {
    return websiteModel
        .remove({_id: websiteId})
        .then(function (status) {
            return userModel.removeWebsite(developerId, websiteId)
        });
}

function findWebsiteById(websiteId) {
    return websiteModel.findById(websiteId);
}

function findWebsitesForUser(developerId) {
    return websiteModel
        .find({developer: developerId})
        .populate('developer', 'username')
        .exec();
}

function createWebsite(developerId, website) {
    website.developer = developerId;
    var websiteTmp = null;
    return websiteModel
        .create(website)
        .then(function (websiteDoc) {
            websiteTmp = websiteDoc;
            return userModel.addWebsite(developerId, websiteDoc._id)
        })
        .then(function (userDoc) {
            return websiteTmp;
        })
}