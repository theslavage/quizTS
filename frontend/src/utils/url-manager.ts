import type { QueryParamsType } from "../types/query-params-type";

export class UrlManager {
    public static getQueryParams(): QueryParamsType {
        const qs = (document.location.hash || "").replace(/\+/g, " ");
        const params = {} as QueryParamsType;
        const re = /[?&]([^=]+)=([^&]*)/g;

        let token: RegExpExecArray | null;
        while ((token = re.exec(qs)) !== null) {
            const key = token[1];
            const val = token[2];
            if (key !== undefined && val !== undefined) {
                (params as any)[decodeURIComponent(key)] = decodeURIComponent(val);
            }
        }
        return params;
    }
}
