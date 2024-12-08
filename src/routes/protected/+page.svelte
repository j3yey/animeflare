<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    // Define interfaces for the fetched data
    interface Anime {
        mal_id: number;
        title: string;
        images: {
            jpg: {
                image_url: string;
            };
        };
    }

    interface Recommendation {
        entry: {
            mal_id: number;
            title: string;
            images: {
                jpg: {
                    image_url: string;
                };
            };
        };
    }

    let searchQuery = '';
    let searchResults = writable<Anime[]>([]);
    let recommendations = writable<Record<number, Recommendation[]>>({});

    const fetchSearchResults = async () => {
        if (!searchQuery.trim()) return;

        try {
            const res = await fetch(`/api?search=${encodeURIComponent(searchQuery)}`);
            if (!res.ok) throw new Error(await res.text());

            const data: { searchResults: Anime[] } = await res.json();
            searchResults.set(data.searchResults);
        } catch (err) {
            console.error('Error fetching search results:', err);
        }
    };

    const fetchRecommendations = async (animeId: number) => {
        try {
            const res = await fetch(`/api?recommendations=${animeId}`);
            if (!res.ok) throw new Error(await res.text());

            const data: { recommendations: Recommendation[] } = await res.json();
            recommendations.update((recMap) => ({
                ...recMap,
                [animeId]: data.recommendations,
            }));
        } catch (err) {
            console.error('Error fetching recommendations:', err);
        }
    };
</script>

<style>
    .anime img, .recommendation img {
        max-width: 100px;
        border-radius: 5px;
        margin-right: 10px;
    }

    .anime, .recommendation {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
</style>

<div class="container">
    <h1>Anime Search & Recommendations</h1>

    <div class="search-bar">
        <input
            type="text"
            placeholder="Search for an anime..."
            bind:value={searchQuery}
        />
        <button on:click={fetchSearchResults}>Search</button>
    </div>

    <div class="results">
        <h2>Search Results</h2>
        {#if $searchResults.length > 0}
            <ul>
                {#each $searchResults as anime}
                    <li class="anime">
                        <img src={anime.images.jpg.image_url} alt={anime.title} />
                        <div>
                            <strong>{anime.title}</strong>
                            <button on:click={() => fetchRecommendations(anime.mal_id)}>
                                Get Recommendations
                            </button>
                        </div>

                        <!-- Show recommendations for this anime -->
                        {#if $recommendations[anime.mal_id]?.length > 0}
                            <ul>
                                {#each $recommendations[anime.mal_id] as rec}
                                    <li class="recommendation">
                                        <img src={rec.entry.images.jpg.image_url} alt={rec.entry.title} />
                                        {rec.entry.title}
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No results found.</p>
        {/if}
    </div>
</div>
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Define types for the Jikan API response
interface Anime {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
}

interface JikanSearchResponse {
    data: Anime[];
}

interface JikanRecommendationsResponse {
    data: {
        entry: Anime;
    }[];
}


const searchQuery = url.searchParams.get('search');
const recommendationsForId = url.searchParams.get('recommendations');

if (searchQuery) {
    try {
        const response = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(searchQuery)}&limit=10`);
        if (!response.ok) {
            throw new Error(`Failed to fetch search results: ${response.statusText}`);
        }

        const data: JikanSearchResponse = await response.json();
        return json({ searchResults: data.data });
    } catch (error) {
        return json({ error: (error as Error).message }, { status: 500 });
    }
}

if (recommendationsForId) {
    try {
        const response = await fetch(`${JIKAN_BASE_URL}/anime/${recommendationsForId}/recommendations`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }

        const data: JikanRecommendationsResponse = await response.json();
        return json({ recommendations: data.data });
    } catch (error) {
        return json({ error: (error as Error).message }, { status: 500 });
    }
}

// Default response if no search or recommendations are requested
return json({ message: "No search query or recommendations provided." }, { status: 400 });
};

export const PUT: RequestHandler = async ({ request }) => {
    const { body, key } = await request.json();
    const decrypted = CryptoJS.AES.decrypt(body, key).toString(CryptoJS.enc.Utf8);
    let requestBody: any = JSON.parse(decrypted);

    if (!requestBody.username || !requestBody.password) {
        return json({ message: "Missing Values!" }, { status: 400 });
    }

    const query = await db.insert(tblUsers).values({ username: requestBody.username, password: sha512(requestBody.password) });
    return json({ success: query.changes > 0 });
};
