export interface OrganizationContent {
    id: String,
    name: string,
    content: string,
    type: string,
    image: string,
}


export interface Organization {
    item: OrganizationContent
}

export const organizationExample = {
    id: 2073601,
    name: "maicroso",
    content: "Empresa dedicada al desarrollo de software.",
    type: "Tecnologia",
    image: "penrose.png",
}