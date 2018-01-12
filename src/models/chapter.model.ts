export class ChapterModel{
    title: string;
    url: string;
    order: number;

    constructor(title, url, order) {
        this.title = title;
        this.url = url;
        this.order = order;
    }
}