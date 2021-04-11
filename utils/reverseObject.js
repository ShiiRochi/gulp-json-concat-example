import uniq from 'lodash.uniq';

const revertObject = (dictionary) => {
    const allFirstLevelKeys = Object.keys(dictionary);

    const allSecondLevelKeys = uniq(
        allFirstLevelKeys.reduce((keys, firstLevelKey) => {
            const messagesKeys = Object.keys(dictionary[firstLevelKey]);
            return [...keys, ...messagesKeys];
        }, [])
    );

    return allSecondLevelKeys.reduce((nextDictionary, secondLevelKey) => {
        const allSecondLevelKeysMessages = allFirstLevelKeys.reduce(
            (result, firstLevelKey) => ({
                ...result,
                // $FlowIgnore
                [firstLevelKey]: dictionary[firstLevelKey][secondLevelKey]
            }),
            {}
        );

        return {
            ...nextDictionary,
            [secondLevelKey]: allSecondLevelKeysMessages
        };
    }, {});
};

export default revertObject;