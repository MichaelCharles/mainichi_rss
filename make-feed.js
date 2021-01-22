import RSS from 'rss-generator'

const makeFeed = (items) => {
    /* lets create an rss feed */
    var feed = new RSS({
        title: 'Mainichi Top News',
        description: 'Top news stories from Mainichi Newspaper.',
        feed_url: process.env.FEED_URL + 'rss.xml',
        site_url: 'http://mainichi.jp/english',
        image_url: 'http://example.com/icon.phttps://res.cloudinary.com/mca62511/image/upload/v1611319765/Screen_Shot_2021-01-22_at_21.48.29_ijnmu2.pngng',
        language: 'en',
        categories: ['Japan'],
        pubDate: new Date().toISOString(),
        ttl: '60',
    });

    items.forEach(({title, url, image, date, description, content}) => {
        feed.item({
            title,
            description: content,
            url,
            date: new Date(date),
        });
    })

    // cache the xml to send to clients
    return feed.xml();
}

export default makeFeed;