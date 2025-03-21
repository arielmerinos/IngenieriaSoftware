import React, { useState } from "react";
import RegisterOpportunity from "./registerOpportunity";

function OpportunitiesButton() {
    const [isOpen, setIsOpen] = useState(false);

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
                            onSubmit={(data) => {
                                console.log("Convocatoria registrada:", data);
                                setIsOpen(false);
                            }}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default OpportunitiesButton;
