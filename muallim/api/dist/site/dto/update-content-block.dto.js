"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContentBlockDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_content_block_dto_1 = require("./create-content-block.dto");
class UpdateContentBlockDto extends (0, mapped_types_1.PartialType)(create_content_block_dto_1.CreateContentBlockDto) {
}
exports.UpdateContentBlockDto = UpdateContentBlockDto;
//# sourceMappingURL=update-content-block.dto.js.map