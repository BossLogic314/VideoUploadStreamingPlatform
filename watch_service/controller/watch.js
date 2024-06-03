import { openSearchClient } from '../opensearch/connect.js';

export let getVideos = (async (req, res) => {
    try {
        const searchString = req.query.searchString;
        const response = await openSearchClient.search({
            index: "video",
            body: {
                query: {
                    query_string: {
                        query: searchString,
                        fields: ["title", "author", "description"],
                        fuzziness: "AUTO"
                    }
                }
            }
        });
        res.status(200).json({response: response});
    }
    catch(error) {
        res.status(500).json({message: error});
    }
});