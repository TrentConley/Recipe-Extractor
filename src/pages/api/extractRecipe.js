import axios from 'axios';
import cheerio from 'cheerio';

const fetchTextFromWebsite = async (url) => {
    try {
        // Fetch the website content
        const { data } = await axios.get(url);

        // Initialize cheerio
        const $ = cheerio.load(data);

        // Extract text from the website
        const textArray = [];
        $('body').find('*').each((index, element) => {
            const text = $(element).text().trim();
            let i = 0;
            if (text) {
                if (i < 2) {
                    console.log(text);
                }
                i++;
                textArray.push(text);
            }
        });

        const allText = textArray.join(' '); // Concatenate all text nodes into a single string
        return allText;

    } catch (error) {
        console.error(`Error fetching text from ${url}: `, error);
        return null;
    }
};


export default async function handler(req, res) {
    const { url } = req.body;

    try {
        console.log(`url is ${url}!`)
        let websiteContent = await fetchTextFromWebsite(url);
        console.log(websiteContent);
        // Call OpenAI API to extract the recipe
        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo-16k',  // Replace with your model
                messages: [
                    {
                        role: 'system',
                        content: 'Extract the first recipie from the follwoing data.'
                    },
                    {
                        role: 'user',
                        content: `Extract the recipe from the following website content: ${websiteContent}`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const recipe = openaiRes.data.choices[0]?.message?.content || 'Recipe not found';
        // Here, you would typically parse the recipe text to extract a list of ingredients for the grocery list
        res.status(200).json({ recipe });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
