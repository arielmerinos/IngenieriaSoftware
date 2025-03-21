import React, { useState } from "react";
import RegisterOpportunity from "./registerOpportunity";

function OpportunitiesButton() {
    const [isOpen, setIsOpen] = useState(false);

    const handleCreateOpportunity = async (data: FormData) => {
        try {
            const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage
            if (!token) {
                throw new Error("User is not authenticated");
            }

            const response = await fetch('http://localhost:8000/api/scholarships/create/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
                body: data,
            });

            if (!response.ok) {
                throw new Error('Failed to create opportunity');
            }

            const result = await response.json();
            console.log('Opportunity created:', result);
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating opportunity:', error);
        }
    };

    return (
        <>
            <div className="text-center mt-10 mb-16">
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition"
                >
                    Crear Convocatoria
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Registro de Convocatoria</h2>
                        <RegisterOpportunity
                            onSubmit={handleCreateOpportunity}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default OpportunitiesButton;
