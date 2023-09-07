"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsQueryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogsQueryValidation = [
    (0, express_validator_1.query)('searchNameTerm').default(null),
    (0, express_validator_1.query)('sortBy').default('createdAt'),
    (0, express_validator_1.query)('sortDirection').default('desc'),
    (0, express_validator_1.query)('pageNumber').default(1),
    (0, express_validator_1.query)('pageSize').default(10)
];
