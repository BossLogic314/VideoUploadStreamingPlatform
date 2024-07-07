import { Client } from '@opensearch-project/opensearch';

export let openSearchClient = null;

export const connectToOpenSearchService = async() => {
    openSearchClient = new Client({
        node: `https://${process.env.OPEN_SEARCH_USERNAME}:${process.env.OPEN_SEARCH_PASSWORD}@os-14f9b1a3-videostreaminguploadplatform.i.aivencloud.com:22906`,
    });
    console.log('Connected to open search service');
}
