"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMediaAssetDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_media_asset_dto_1 = require("./create-media-asset.dto");
class UpdateMediaAssetDto extends (0, mapped_types_1.PartialType)(create_media_asset_dto_1.CreateMediaAssetDto) {
}
exports.UpdateMediaAssetDto = UpdateMediaAssetDto;
//# sourceMappingURL=update-media-asset.dto.js.map