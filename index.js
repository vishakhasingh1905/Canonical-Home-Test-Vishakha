// Function to asynchronously fetch category name from category link
async function fetchCategoryName(categoryLink) {
    try {
        const response = await fetch(categoryLink);
        if (response.ok) {
            const categoryData = await response.json();
            return categoryData.name;
        }
    } catch (error) {
        console.error('Category data retrieval error:', error);
    }
    return null;
}

// Function to create a card for a blog post
function createCard(post) {
    // Destructure post properties for easier access
    const {
        title: { rendered: title },
        content: { rendered: content },
        _embedded: { author: [author] },
        date,
        featured_media: imageUrl,
        type,
        categories
    } = post;

    // Create column and card elements
    const col = document.createElement('div');
    col.classList.add('col-4', 'show');

    const card = document.createElement('div');
    card.classList.add('p-card--highlighted');

    // Create content div for card
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('p-card__content');

    const categoriesElement = document.createElement('span');
    contentDiv.appendChild(categoriesElement);

    // Create separators for styling
    const separator1 = document.createElement('hr');
    separator1.classList.add('p-separator');

    const separator = document.createElement('hr');
    separator.classList.add('p-separator');

    // Create an image element for the post cover image
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = 'Post cover image';

    // Create a title element with a link to the post
    const titleElement = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleElement.appendChild(titleLink);
    titleLink.href = post.link;
    titleLink.textContent = title;

    // Create an author element with a link to the author's page
    const authorElement = document.createElement('a');
    authorElement.href = author.link;
    authorElement.textContent = author.name;

    // Create a date element for the post publication date
    const dateElement = document.createElement('p');
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    dateElement.innerHTML = `By ${authorElement.outerHTML} on ${formattedDate}`;
    dateElement.classList.add('p-heading--6');

    const typeElement = document.createElement('p');
    typeElement.textContent = type.replace(/^\w/, (c) => c.toUpperCase());

    // Fetch and display category name
    (async () => {
        const categoryName = await fetchCategoryName(
            `https://admin.insights.ubuntu.com/wp-json/wp/v2/categories/${categories}`
        );
        if (categoryName) {
            categoriesElement.textContent = categoryName.toUpperCase();
        }
    })();

    // Append elements to the content div
    contentDiv.appendChild(separator1);
    contentDiv.appendChild(image);
    contentDiv.appendChild(titleElement);
    contentDiv.appendChild(dateElement);
    contentDiv.appendChild(separator);
    contentDiv.appendChild(typeElement);

    // Append the content div to the card
    card.appendChild(contentDiv);

    // Append the card to the column div
    col.appendChild(card);

    // Return the column div as the card element
    return col;
}

// Fetch blog post data and create cards
fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json')
    .then(response => response.json())
    .then(data => {
        const root = document.getElementById('root');
        // Loop through the first 3 posts to create and append cards
        data.slice(0, 3).forEach(post => {
            const card = createCard(post);
            root.appendChild(card);
        });
    })
    .catch(error => {
        console.error(error);
    });
