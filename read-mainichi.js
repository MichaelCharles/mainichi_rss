import dotenv from "dotenv";
import jsdom from "jsdom";
import axios from 'axios';
import makeFeed from "./make-feed.js";
dotenv.config();
const { JSDOM } = jsdom;

function getMeta(metaName, document) {
    const metas = document.getElementsByTagName('meta');
  
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
        return metas[i].getAttribute('content');
      }
    }
  
    return '';
  }

const getItems = async (items) => {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        const { data: itemData } = await axios.get(items[i])
        const { document: itemArticleDoc } = (new JSDOM(`${itemData}`)).window;
        const title = itemArticleDoc.querySelector('header h1').textContent

        const date = getMeta('lastupdate', itemArticleDoc)
        
        const tools = itemArticleDoc.querySelector('#tools');
        if (tools) tools.remove();
        const videos = itemArticleDoc.querySelectorAll('video');
        for (let video of videos) {
            video.outerHTML = "<strong>A video was embedded in the article. Open in a browser to view.</strong>";
        }

        const itemText = itemArticleDoc.getElementsByClassName('main-text');

        const itemTextContent = [];
        for (let textNode of itemText) {
            itemTextContent.push(textNode.outerHTML)
        }
        const contentTextString = itemTextContent.join('');
        result.push({ title, url: items[i], date, content: contentTextString });
    }
    return result;
}

async function readMainichi() {
    const { data: frontPageData } = await axios.get('https://mainichi.jp/english');
    const { document: frontpage } = (new JSDOM(`${frontPageData}`)).window;
    const allURLs = [];

    const pickup = frontpage.querySelector('section.pickup.section');
    const pickupUrl = `https:` + pickup.querySelector('.midashi a').href;
    allURLs.push(pickupUrl);

    const mainURLNodes = frontpage.querySelectorAll('.main-box a');
    
    for (let url of mainURLNodes) {
        allURLs.push(`https:` + url.href)
    }
    const items = await getItems(allURLs)

    const result = makeFeed(items)

    return result;


}

export default readMainichi;