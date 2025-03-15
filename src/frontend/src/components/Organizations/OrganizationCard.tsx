import React from 'react';
// import penrose from "../assets/penrose.png"

const penrose = "penrose.png"

interface OrganizationContent {
    name: string,
    content: string,
    type: string,
    image: string,
}

interface Organization {
    item: OrganizationContent
}


const OrganizationCard: React.FC<Organization> = ({ item }) => {
    return (
        <div className='bg-white rounded-lg overflow-hidden shadow flex w-full max-w-lg'>
            <div className='w-1/3'>
                <img
                    src={item.image ?? penrose}
                    alt={`Imagen de ${item.name}`}
                    className="w-full h-full object-cover"
                    role="img"
                />
            </div>
            <div className='w-2/3 p-4 text-left'>
                <h1 className="font-bold text-lg mb-1">{item.name}</h1>
                <p className='rounded-lg text-xs text-gray-500 bg-gray-200 w-fit px-2 py-px border-gray-5000 rounded-full'>
                    {item.type}
                </p>
                <p className='mt-2'>{item.content}</p>
            </div>
        </div>
    );
};


export default OrganizationCard;