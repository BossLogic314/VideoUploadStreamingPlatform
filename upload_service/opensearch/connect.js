import { Client } from '@opensearch-project/opensearch';

export let openSearchClient = null;

export const connectToOpenSearchService = async() => {
    openSearchClient = new Client({
        node: `https://${process.env.OPEN_SEARCH_USERNAME}:${process.env.OPEN_SEARCH_PASSWORD}@os-7491aba-videostreaminguploadplatform.f.aivencloud.com:22906`,
    });
    console.log('Connected to open search service');
}
