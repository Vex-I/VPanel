import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkWikiLink from "remark-wiki-link";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export const renderMarkdown = async (md) => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
    const file = await processor.process(md);
    return(file);
}

//Parse the obsidian wiki links inside the markdown into the standard
//hyperlink format for markdown.
//The destination of the hyperlink is simply /[title], with the title 
//being forced into lowercase and whitespaces replaced by dash.
//Then, turn it into HTML. 
export const wikilinkRender = async (md) => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkWikiLink)
        .use(remarkRehype)
        .use(rehypeStringify)

    const file = await processor.process(md);
    return(file);
}
