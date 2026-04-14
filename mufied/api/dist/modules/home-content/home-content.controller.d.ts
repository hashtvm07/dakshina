import { HomeContentService } from './home-content.service';
import { HomeContentDocument } from './home-content.types';
import { HomeContentDto } from './dto/home-content.dto';
export declare class HomeContentController {
    private readonly homeContentService;
    constructor(homeContentService: HomeContentService);
    getHomeContent(): Promise<HomeContentDocument>;
    updateHomeContent(content: HomeContentDto): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
}
