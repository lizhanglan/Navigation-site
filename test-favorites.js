console.log('Local Storage Test'); const website = { id: 1, title: 'Test Website', url: 'https://example.com', description: 'Test description', category_id: 1, thumbnail: null, thumbnail_base64: null, status: 'approved', visits: 0, likes: 0, last_visited_at: null }; localStorage.setItem('favorites', JSON.stringify([website])); console.log('Added test website to favorites:', JSON.parse(localStorage.getItem('favorites')));
