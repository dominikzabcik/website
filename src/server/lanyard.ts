import type { Types, API } from '@prequist/lanyard';

export type Snowflake = Types.Snowflake;

export async function getLanyard(id: Snowflake): Promise<Types.Presence> {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
    const lanyard = await response.json() as API.EitherAPIResponse<Types.Presence>;

    if (!lanyard.success) {
        throw new Error('Lanyard API failed');
    }

    return lanyard.data;
}
