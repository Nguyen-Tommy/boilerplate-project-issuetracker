'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    project: { type: String, hide: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: String, required: true },
    updated_on: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    open: { type: Boolean, default: true, required: true },
    status_text: { type: String }
}, { versionKey: false });

module.exports = mongoose.model("issueModel", issueSchema);