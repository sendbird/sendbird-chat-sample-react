export declare enum GroupChannelListOrder {
    LATEST_LAST_MESSAGE = "latest_last_message",
    CHRONOLOGICAL = "chronological",
    CHANNEL_NAME_ALPHABETICAL = "channel_name_alphabetical",
    METADATA_VALUE_ALPHABETICAL = "metadata_value_alphabetical"
}
export declare enum PublicGroupChannelListOrder {
    CHRONOLOGICAL = "chronological",
    CHANNEL_NAME_ALPHABETICAL = "channel_name_alphabetical",
    METADATA_VALUE_ALPHABETICAL = "metadata_value_alphabetical"
}
/**
 * @internal
 */
export declare const getGroupChannelIndexBy: (order: GroupChannelListOrder) => string[];
