import {TomeModel} from "./tome.model";
import {ChapterModel} from "./chapter.model";

export class DownloadModel{
    order: number;
    title: string;
    tome: TomeModel;
    chapter: ChapterModel;
    compression: boolean;

    constructor(order: number, title: string, compression: boolean = true,
                tome: TomeModel = null, chapter: ChapterModel = null) {
        this.order = order;
        this.title = title;
        this.compression = compression;
        this.tome = tome;
        this.chapter = chapter;
    }
}