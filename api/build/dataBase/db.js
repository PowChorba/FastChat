"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_CONNECTION || "test");
        console.log("Db connected");
    }
    catch (e) {
        console.log(e, "db fail");
    }
});
module.exports = {
    dbConnection
};
