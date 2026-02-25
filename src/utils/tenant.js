export const getSubdomain = () => {
    // Examples: 
    // localhost:5173 -> return null
    // kampala.localhost:5173 -> return 'kampala'
    // xyz.edumanage.com -> return 'xyz'

    const host = window.location.hostname;

    // For local development, treat everything before .localhost or .lvh.me as subdomain
    if (host.includes('localhost') || host.includes('lvh.me')) {
        const parts = host.split('.');
        // lvh.me splits into 2 parts. localhost splits into 1.
        // kampala.lvh.me splits into 3. kampala.localhost splits into 2.

        if (host.includes('lvh.me')) {
            if (parts.length > 2) {
                return parts[0];
            }
            return null; // Just lvh.me
        } else {
            if (parts.length > 1 && parts[0] !== 'localhost') {
                return parts[0];
            }
            return null; // Just localhost
        }
    }

    // For production (e.g., edumanage.com)
    // Adjust logic accordingly once production domain is known.
    // For now assuming: subdomain.domain.com
    const parts = host.split('.');

    // Simplistic check for standard domains (e.g., domain.com)
    // If it's something like app.co.uk this logic would need tweaking.
    if (parts.length >= 3) {
        return parts[0];
    }

    return null;
}

export const isMainDomain = () => {
    return getSubdomain() === null;
}
