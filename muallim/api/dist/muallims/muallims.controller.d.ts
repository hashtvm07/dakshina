import { CreateMuallimDto } from './dto/create-muallim.dto';
import { MuallimsService } from './muallims.service';
export declare class MuallimsController {
    private readonly muallimsService;
    constructor(muallimsService: MuallimsService);
    listMuallims(query?: string): Promise<import("./entities/muallim.entity").Muallim[]>;
    findByPublicId(publicId: string): Promise<import("./entities/muallim.entity").Muallim>;
    registerMuallim(dto: CreateMuallimDto): Promise<import("./entities/muallim.entity").Muallim>;
}
