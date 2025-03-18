import React, { Suspense, useState } from "react";
import "./Landing.css";
import RegisterOrganizationForm from "../components/Organizations/RegisterOrganization";

const Header = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));
const Organizations = React.lazy(() => import("../components/Organizations/Organizations"));

function OrganizationsFeed() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="w-full min-h-screen flex flex-col">
            <Suspense fallback={<div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
            </div>}>
                <Header />
                <div className="flex-1">
                    <Organizations />
                </div>
                <div className="text-center mt-10 mb-16">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition"
                    >
                        Crear Organización
                    </button>
                </div>
                <Footer />
            </Suspense>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Registro de Organización</h2>
                        <RegisterOrganizationForm
                            onSubmit={(data) => {
                                console.log("Organización registrada:", data);
                                setIsOpen(false); // Cierra el modal después de registrar
                            }}
                            onClose={() => setIsOpen(false)} // Asegura que el modal se cierre
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default OrganizationsFeed;
