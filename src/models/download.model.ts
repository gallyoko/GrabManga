import {TomeModel} from "./tome.model";
import {ChapterModel} from "./chapter.model";

export class DownloadModel{
    order: number;
    tome: TomeModel;
    chapter: ChapterModel;
    compression: boolean;

    constructor(order: number, compression: boolean = true, tome: TomeModel = null, chapter: ChapterModel = null) {
        this.order = order;
        this.compression = compression;
        this.tome = tome;
        this.chapter = chapter;
    }
}