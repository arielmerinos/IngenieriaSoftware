/*
Nombre del programa: Impulsa tu futuro
Copyright (C) 2025 - Autores:
Merino Peña Kevin Ariel
Ortíz Montiel Diego Iain
Rodríguez Dimayuga Laura Itzel
Sosa Romo Juan Mario
Vargas Campos Miguel Angel

Este programa es software libre: puede redistribuirlo y/o modificarlo
bajo los términos de la Licencia Pública General de GNU v3 publicada por
la Free Software Foundation.

Este programa se distribuye con la esperanza de que sea útil,
pero SIN NINGUNA GARANTÍA; sin incluso la garantía implícita de
COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
Consulte la Licencia Pública General de GNU para más detalles.

Debería haber recibido una copia de la Licencia Pública General de GNU
junto con este programa. Si no, consulte <https://www.gnu.org/licenses/>.
*/

import React, { Suspense, useState } from "react";
import axios from 'axios';
import "./Landing.css";
import RegisterOrganizationForm from "../components/Organizations/RegisterOrganization";
import { OrganizationData } from '../components/Organizations/RegisterOrganization'; 

const Header = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));
const Organizations = React.lazy(() => import("../components/Organizations/Organizations"));

function OrganizationsFeed() {
    const [isOpen, setIsOpen] = useState(false);

    const handleRegisterOrganization = async (data: OrganizationData) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No se encontró token de autenticación.');
                return;
            }

            const response = await axios.post(
                'http://0.0.0.0:8000/organization/create/',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Organización creada exitosamente:', response.data);
            setIsOpen(false);
        } catch (error) {
            console.error('Error al registrar la organización:', error);
        }
    };

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
                            onSubmit={handleRegisterOrganization}
                            onClose={() => setIsOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default OrganizationsFeed;

