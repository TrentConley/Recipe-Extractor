import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.body;

    try {
        // Use axios and cheerio for web scraping
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let websiteContent = '';
        $('body').each((i, element) => {
            websiteContent += $(element).text();
        });

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
