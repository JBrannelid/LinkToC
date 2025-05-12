import SearchConfigBuilder from './SearchConfigBuilder';
import { stableService, userService, horseService } from '../../../api/index.js';
import HorseResultRenderer from "../HorseResultRenderer";
import UserResultRenderer from "../UserResultRenderer";


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

export const createHorseSearchConfig = (options = {}) => {
    return new SearchConfigBuilder('horse')
        // Set the search function with the horseService
        // NEEDS PROPER API CALL
        .withSearchFunction(horseService.search)

        // Configure field mappings
        .withFields({
            idField: 'id',
            labelField: 'name',
            secondaryField: 'breed',
            imageField: 'profileImage'
        })

        // Set UI text
        .withUIText({
            placeholder: 'Search for horses...',
            actionButton: 'Select',
            cancelButton: 'Cancel',
            noResults: "Can't find any horse with that name. Try another search.",
            error: 'An error occurred while searching. Try again later.',
            loading: 'Searching for horses...',
            emptyPrompt: 'Enter a horse name to search'
        })

        // Set custom renderer
        .withResultRenderer(HorseResultRenderer)

        // Apply custom options and build
        .withCustomProps(options)
        .build();
};

export const createUserSearchConfig = (options = {}) => {
    return new SearchConfigBuilder('user')
        // Set the search function with the userService
        // NEEDS PROPER API CALL
        .withSearchFunction(userService.searchUsers)

        // Configure field mappings
        .withFields({
            idField: 'id',
            labelField: 'firstName',
            secondaryField: 'lastName',
            imageField: 'profileImage'
        })

        // Set UI text
        .withUIText({
            placeholder: 'Search for users...',
            actionButton: 'Select',
            cancelButton: 'Cancel',
            noResults: "Can't find any users with that name. Try another search.",
            error: 'An error occurred while searching for users. Try again later.',
            loading: 'Searching for users...',
            emptyPrompt: 'Enter a user name to search'
        })

        // Set custom renderer
        .withResultRenderer(UserResultRenderer)

        // Apply custom options and build
        .withCustomProps(options)
        .build();
};