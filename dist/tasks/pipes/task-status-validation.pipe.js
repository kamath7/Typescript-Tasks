"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const tasks_status_enum_1 = require("../tasks.status.enum");
class TaskStatusValidationPipe {
    constructor() {
        this.allowedStatuses = [
            tasks_status_enum_1.TaskStatus.OPEN,
            tasks_status_enum_1.TaskStatus.IN_PROGRESS,
            tasks_status_enum_1.TaskStatus.DONE,
        ];
    }
    transform(value) {
        if (!this.isStatusValid(value)) {
            throw new common_1.BadRequestException(`${value} is an invalid status`);
        }
        return value;
    }
    isStatusValid(status) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
exports.TaskStatusValidationPipe = TaskStatusValidationPipe;
//# sourceMappingURL=task-status-validation.pipe.js.map