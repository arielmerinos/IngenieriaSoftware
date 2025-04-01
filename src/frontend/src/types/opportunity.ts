export interface OpportunityContent {
    id: number,
    organization: string, // Dejar como string vacio si no tiene
    name: string,
    published: Date,
    beginning: Date,
    end: Date,
    type: string,
    image: string,
    content: string,
    interests: string[],
    author: string,
    country: string
}

export interface Opportunity {
    item: OpportunityContent
}

    /**
     * @param element JSON
     * @returns Una opportunity con la info del JSON.
     */
export function parseOpportunity(element : any){
    const baseUrl = "http://localhost:8000"; // Base URL for media files
    let newElem = {
        id: element.id,
        organization: element.organization || "", // Default to empty string if not present
        name: element.name,
        published: new Date(element.publication_date),
        beginning: new Date(element.start_date),
        end: new Date(element.end_date),
        type: element.type,
        image: element.image ? `${baseUrl}${element.image}` : "/call-placeholder.png", // Prepend base URL or use placeholder
        content: element.content,
        interests: element.interests || [],
        author: element.created_by,
        country: element.country || "Mexico"
    };
    // console.log(newElem);
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