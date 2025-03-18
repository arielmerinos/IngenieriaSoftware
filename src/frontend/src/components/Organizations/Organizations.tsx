import OrganizationCard from "../Organizations/OrganizationCard";

const opportunityExample = {
    name: "maicroso",
    content: "Empresa dedicada al desarrollo de software",
    type: "tecnologoia",
    image: "penrose.png",
}

const Organizations: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 mt-10">
            <OrganizationCard item={opportunityExample}></OrganizationCard>
            <OrganizationCard item={opportunityExample}></OrganizationCard>

        </div>
    )
}

export default Organizations;
