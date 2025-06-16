export interface OpportunityContent {
    id: number,
    organization: string, // Dejar como string vacio si no tiene
    name: string,
    published: Date,
    beginning: Date,
    end: Date,
    type: string[],
    image: string,
    content: string,
    interests: string[],
    author: string,
    country: string[] | string
}

export interface Opportunity {
    item: OpportunityContent
}

/**
 * Parse an opportunity object from API response and ensure proper formatting
 * @param element JSON object from API
 * @returns A properly formatted opportunity with absolute image URLs
 */
export function parseOpportunity(element: any) {
    const baseUrl = "http://localhost:8000"; // Base URL for media files
    
    // Helper function to ensure image URL is absolute
    const ensureAbsoluteImageUrl = (url: string): string => {
        if (!url) return "/call-placeholder.png";
        if (url.startsWith('http')) return url;
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    
    let newElem = {
        id: element.id,
        organization: element.organization || "", // Default to empty string if not present
        name: element.name,
        published: new Date(element.publication_date),
        beginning: new Date(element.start_date),
        end: new Date(element.end_date),
        type: element.type.map((t: any) => t.name), // Extract only the names from the type array
        // Ensure image URL is absolute
        image: ensureAbsoluteImageUrl(element.image),
        content: element.content,
        interests: element.interests.map((i: any) => i.name), // Extract only the names from the interests array
        author: element.created_by,
        country: element.country.map((c: any) => c.name), // Extract only the names from the country array
    };
    
    return newElem;
}

export const opportunityExample = {
    id: 2073600,
    organization: "Eusan Nation",
    // organization: "",
    name: "Becario Explorador Espacial",
    published: new Date("13-Mar-25"),
    beginning: new Date("13-Mar-25"),
    end: new Date("13-Mar-26"),
    type: "Becario",
    image: "penrose.png",
    content: "Ayuda a la Nación Eusan a descubrir nuevos planetas habitables.",
    interests: ["Exploración Espacial", "Mecánica", "Horror Cósmico"],
    author: "Falke",
    country: "Eusan"
}

export const opportunityExample2 = {
    id: 2073600,
    organization: "",
    name: "Backstage Assistant",
    published: new Date("13-Mar-25"),
    beginning: new Date("13-Mar-25"),
    end: new Date("13-Mar-26"),
    type: [
        "Internacional",
        "Beca completa"
    ],
    image: "miku.png",
    content: "¿Te gusta Vocaloid? Ayudame a preparar todo para mis presentaciones.",
    interests: ["Música"],
    author: "Miku",
    country: "México"
}