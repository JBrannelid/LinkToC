import { createResponseHandler } from './responseHandlers.js';
import baseSearchConfig from './searchConfigBase';

class SearchConfigBuilder {
    constructor(entityType) {
        // Create config with proper defaults
        this.config = {
            ...baseSearchConfig,
            entityType: entityType || 'generic',
            // Always single selection mode
        };
    }
    
    withSearchFunction(searchFn, options = {}) {
        // Create response handler
        const responseHandler = createResponseHandler(options);

        this.config.searchFn = async (query) => {
            try {
                // Build search parameters
                const params = {
                    searchTerm: query,
                    page: 0,
                    pageSize: 10,
                    ...options.params
                };

                // Call search function and process response
                const response = await searchFn(params);
                return responseHandler(response);
            } catch (error) {
                console.error(`${this.config.entityType} search error:`, error);
                return {
                    success: false,
                    data: [],
                    message: error.message || 'Search failed',
                    error
                };
            }
        };

        return this;
    }

    withFields(fields = {}) {
        const fieldMappings = {
            idField: fields.idField || 'id',
            labelField: fields.labelField || 'name',
            secondaryField: fields.secondaryField,
            imageField: fields.imageField,
            tertiaryField: fields.tertiaryField,
            typeField: fields.typeField
        };

        Object.entries(fieldMappings).forEach(([key, value]) => {
            if (value !== undefined) {
                this.config[key] = value;
            }
        });

        return this;
    }
    
    withUIText(text = {}) {
        const textMappings = {
            placeholderText: text.placeholder,
            actionButtonText: text.actionButton,
            cancelButtonText: text.cancelButton,
            noResultsText: text.noResults,
            errorText: text.error,
            loadingText: text.loading,
            emptySearchPrompt: text.emptyPrompt
        };

        Object.entries(textMappings).forEach(([key, value]) => {
            if (value !== undefined) {
                this.config[key] = value;
            }
        });

        return this;
    }


    withResultRenderer(renderer) {
        this.config.resultItemRenderer = renderer;
        return this;
    }


    withLayout(type, columns = 1) {
        this.config.layout = type === 'grid' ? 'grid' : 'list';
        if (type === 'grid') {
            this.config.columns = columns;
        }
        return this;
    }
    
    withCustomProps(props = {}) {
        this.config = {
            ...this.config,
            ...props
        };
        return this;
    }

    build() {
        // Final validation
        if (!this.config.entityType) {
            console.warn('Search config is missing entityType');
        }

        if (!this.config.searchFn) {
            console.warn(`Search config for ${this.config.entityType || 'unknown'} is missing searchFn`);
        }

        return this.config;
    }
}

export default SearchConfigBuilder;