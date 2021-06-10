import fs from 'fs';

export type Post = {
    id: number; 
    title: string;
    coverUrl: string;
    contentPreview: string;
    content: string;
    commentCount: number;
}

export interface PostComments {
    postId: number;
    comments: Comment[];
}

export interface Comment {
    id: number;
    postId: number;
    author: string;
    content: string;
}

export interface Data {
    posts: Post[];
    comments: PostComments[],
    counter: number;
}

const defaultData: Data = {
    posts: [],
    comments: [],
    counter: 0
}

export function fileLoader(): Data {
    if (fs.existsSync("./data/data.json")) {
        return {...JSON.parse(fs.readFileSync('./data/data.json',{encoding:'utf8', flag:'r'}))}
    } else {
        fs.writeFileSync( './data/data.json', JSON.stringify(defaultData), { encoding: "utf8",flag: "w"});
        return defaultData;
    }
}

export function fileWrite(data: Data): void {
    fs.writeFileSync( './data/data.json', JSON.stringify(data), { encoding: "utf8",flag: "w"})
}