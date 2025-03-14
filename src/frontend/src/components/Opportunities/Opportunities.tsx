import OpportunityCard from "./OpportunityCard"

const opportunityExample = {
    id: 2073600,
    name: "Becario Explorador Espacial",
    content: "Ayuda a la Nación Eusan a descubrir nuevos planetas habitables.",
    published: new Date("13-Mar-25"),
    beginning: new Date("13-Mar-25"),
    end: new Date("13-Mar-26"),
    type: "Becario",
    image: "penrose.png",
    author: "Eusan Nation"
}

const Opportunities: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 mt-10">
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            
        </div>
    )
}

export default Opportunities;
