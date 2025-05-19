import SearchConfigBuilder from './SearchConfigBuilder';
import { stableService} from '../../../api/index.js';



export const createStableSearchConfig = (options = {}) => {
    return new SearchConfigBuilder('stable')
        // Set the search function with the stableService
        .withSearchFunction(stableService.search, {
            alternativeDataPath: 'value',
            alternativeSuccessPath: 'isSuccess'
        })

        // Configure field mappings
        .withFields({
            idField: 'id',
            labelField: 'name',
            secondaryField: 'county',
            tertiaryField: 'address',
            typeField: 'type',
            imageField: 'image'
        })

        // Set UI text
        .withUIText({
            placeholder: 'Search for stable name...',
            actionButton: 'Join',
            cancelButton: 'Return',
            noResults: "Can't find a stable with that name. Try another name.",
            error: 'An error occurred while searching. Try again later.',
            loading: 'Searching for stables...',
            emptyPrompt: 'Enter a stable name to search'
        })

        // Apply custom options and build
        .withCustomProps(options)
        .build();
};
