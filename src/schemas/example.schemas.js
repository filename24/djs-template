"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let schema = new mongoose_1.Schema({
    user: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    }
});
exports.default = (0, mongoose_1.model)('user', schema, 'user');
