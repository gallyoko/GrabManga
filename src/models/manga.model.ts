export class MangaModel{
    title: string;
    url: string;
    synopsis: string = '';
    tomes: any = [];

    constructor(title, url) {
        this.title = title;
        this.url = url;
    }
}