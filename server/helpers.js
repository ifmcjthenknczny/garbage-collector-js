export function generateQuerySyntax(indexName, query) {
    return ({
        $search: {
            index: indexName,
            text: {
                query: query,
                path: {
                    wildcard: '*'
                }
            }
        }
    })
}

export function generateProjectObject(...fields) {
    const projectObject = {
        $project: {
            _id: 1,
            score: {
                $meta: 'searchScore'
            }
        }
    }
    fields.forEach(e => projectObject.$project[e] = 1)
    return projectObject
}

export function generateSearchResultObject(item, score) {
    return ({
        _id: item._id,
        name: item.name,
        collectionId: item.collectionId,
        score: score
    })
}