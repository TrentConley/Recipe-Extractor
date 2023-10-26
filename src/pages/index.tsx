import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '@/components/Footer';


export default function Home() {
  const [url, setUrl] = useState('');
  const [groceryList, setGroceryList] = useState<string[]>([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/extractRecipe', { url });
      const newIngredient = res.data.recipe;
      setGroceryList([...groceryList, newIngredient]);
    } catch (error) {
      console.error('Error extracting recipe', error);
    }
  };

  return (
    <div className='full-page'>
      <Header />
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter recipe URL"
            className="p-2 border rounded transparent-input"
          />
          <button type="submit" className="p-2 mt-2 text-white rounded">
            Add to Grocery List
          </button>
        </form>

        {groceryList.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Your Grocery List:</h2>
            <ul className="list-disc pl-5">
              {groceryList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
