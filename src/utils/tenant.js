export const getSubdomain = () => {
    // 1. Check URL search param (?tenant=kampala or ?school=kampala) for offline/local testing
    const searchParams = new URLSearchParams(window.location.search);
    const queryTenant = searchParams.get('tenant') || searchParams.get('school') || searchParams.get('subdomain');
    if (queryTenant) {
        return queryTenant.toLowerCase();
    }

    const host = window.location.hostname;

    // 2. For local development (e.g. kampala.localhost or kampala.lvh.me)
    if (host.includes('localhost') || host.includes('lvh.me') || host.includes('127.0.0.1')) {
        const parts = host.split('.');

        if (host.includes('lvh.me')) {
            if (parts.length > 2) {
                return parts[0].toLowerCase();
            }
            return null; // Just lvh.me
        } else if (host.includes('localhost')) {
            // kampala.localhost splits into ['kampala', 'localhost']
            if (parts.length > 1 && parts[0] !== 'localhost') {
                return parts[0].toLowerCase();
            }
            return null; // Just localhost
        }
        return null;
    }

    // 3. For production (e.g., kampala.edumanage.com)
    const parts = host.split('.');
    if (parts.length >= 3) {
        return parts[0].toLowerCase();
    }

    return null;
}

export const isMainDomain = () => {
    return getSubdomain() === null;
}
