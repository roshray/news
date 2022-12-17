import { gql } from "graphql-request"
import sortNewsByImage from "./sortNewsByImage"

const fetchNews =  async (
 category?: Category | string,
 keywords?: string,
 isDynamic?: boolean
) => {   
    // GraphQL query
    const query = gql`
        query MyQuery(
            $access_key:String!
            $categories: String!
            $keywords: String

        )   {

            myQuery(
                access_key: $access_key
                categories: $categories
                countries: 'gb'
                sort: 'published_desc'
                keywords: $keywords
                ) {
                data {
                    author
                    category
                    country
                    description
                    image
                    language
                    published_at
                    source
                    title
                    url
                }
                pagination {
                    count
                    limit
                    offset
                    total
                }
            }
      }    
    `
    // Fetch function with Next.js 13 caching....

      const res = await fetch('https://bijie.stepzen.net/api/aib/__graphql', {
        method: 'POST',
        cache: isDynamic ? "no-cache" : "default",
        next: isDynamic ? { revalidate: 0} : { revalidate: 20 },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`
        },
        body: JSON.stringify({
            query,
            variables: {
                 access_key: process.env.MEDIASTACK_API_KEY,
                 categories: category,
                 keywords: keywords,
            }
        })
      })
    // Sort function by images vs not images present
      console.log("LOADING NEW DATA API for category >>> ", 
        category,
        keywords
      )
    
    // return res

    const newsResponse = await res.json()

    const news = sortNewsByImage(newsResponse.data.myQuery)

    return news
}

export default fetchNews

//stepzen import curl http://api.mediastack.com/v1/news?access_key=8a904fe1e4adb4a371f9b807cf1593a8
// stepzen import http://api.mediastack.com/v1/news?access_key=8a904fe1e4adb4a371f9b807cf1593a8&countries=us%2Cgb&limit=100&offset=0&sort=published_desc