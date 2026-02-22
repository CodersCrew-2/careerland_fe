'use server';

import Parser from 'rss-parser';

export interface RSSFeedItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    category: string;
    source: string;
}

const parser = new Parser();

// Array of public RSS feeds related to career, tech, finance, and business
const FEEDS = [
    { url: 'https://news.ycombinator.com/rss', category: 'AI & Tech', source: 'HackerNews' },
    { url: 'https://techcrunch.com/feed/', category: 'AI & Tech', source: 'TechCrunch' },
    { url: 'https://dev.to/feed', category: 'AI & Tech', source: 'Dev.to' },
    { url: 'https://feeds.feedburner.com/entrepreneur/latest', category: 'Business', source: 'Entrepreneur' },
    { url: 'https://www.cnbc.com/id/19746125/device/rss/rss.html', category: 'Finance', source: 'CNBC' },
    { url: 'https://feeds.feedburner.com/FastCompany/headlines', category: 'Business', source: 'Fast Company' },
    { url: 'https://www.smashingmagazine.com/feed/', category: 'Design', source: 'Smashing Mag' },
    { url: 'https://css-tricks.com/feed/', category: 'Design', source: 'CSS-Tricks' },
];

export async function fetchLiveForums(): Promise<RSSFeedItem[]> {
    try {
        const fetchPromises = FEEDS.map(async (feed) => {
            try {
                // Fetch RSS using parallel requests with high timeout tolerance
                const feedDoc = await parser.parseURL(feed.url);

                return feedDoc.items.slice(0, 10).map((item) => ({
                    id: item.guid || item.link || Math.random().toString(),
                    title: item.title || 'Untitled',
                    link: item.link || '#',
                    pubDate: item.pubDate || new Date().toISOString(),
                    contentSnippet: item.contentSnippet ? item.contentSnippet.split(' ').slice(0, 30).join(' ') + '...' : 'Live discussion regarding this topic.',
                    category: feed.category,
                    source: feed.source
                }));
            } catch (err) {
                console.error(`Failed to parse feed ${feed.url}`, err);
                return [];
            }
        });

        const allItems = (await Promise.all(fetchPromises)).flat();

        // Sort by date (descending)
        return allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    } catch (error) {
        console.error('Error fetching live forums:', error);
        return [];
    }
}
