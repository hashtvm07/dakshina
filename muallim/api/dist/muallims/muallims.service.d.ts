import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateMuallimDto } from './dto/create-muallim.dto';
import { Muallim } from './entities/muallim.entity';
export declare class MuallimsService {
    private readonly muallimRepository;
    private readonly usersService;
    constructor(muallimRepository: Repository<Muallim>, usersService: UsersService);
    registerMuallim(dto: CreateMuallimDto): Promise<Muallim>;
    listMuallims(query?: string): Promise<Muallim[]>;
    findByPublicId(publicId: string): Promise<Muallim>;
}
