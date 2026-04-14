"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVacancyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vacancy_dto_1 = require("./create-vacancy.dto");
class UpdateVacancyDto extends (0, mapped_types_1.PartialType)(create_vacancy_dto_1.CreateVacancyDto) {
}
exports.UpdateVacancyDto = UpdateVacancyDto;
//# sourceMappingURL=update-vacancy.dto.js.map