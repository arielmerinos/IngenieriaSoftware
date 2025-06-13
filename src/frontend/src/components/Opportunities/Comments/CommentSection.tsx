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
import { useEffect, useState } from "react";
import apiInstance from "../../../services/axiosInstance";
import { Comment, parseComment } from "../../../types/comment"
import { CommentCard } from "./CommentCard";
import { useAuth } from "../../../contexts/AuthContext";
import { PaperAirplaneIcon } from '@heroicons/react/outline';
import { useForm } from "react-hook-form";
import { OpportunityContent } from "../../../types/opportunity";

interface FormData {
    content: string
}

export function CommentSection( { opportunityContent }: { opportunityContent: OpportunityContent } ) {

    const { register, handleSubmit, reset, formState: { isValid } } = useForm<FormData>({ mode: 'onChange' });
    const authContext = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);

    const handleCommentSubmit = (data: FormData) => {
        if (!authContext.isAuthenticated) {
            console.error("Usuario no autenticado");
            return;
        }

        apiInstance.put(
            `scholarships/${ opportunityContent.id }/comment/`,
            { content: data.content },
            { headers: { 'Authorization': `Bearer ${ authContext.authToken }` } }
        )

        .then(response => {
            const newComment = parseComment(response.data);
            setComments([...comments, newComment]);
            reset(); // Limpiar el formulario después de enviar
        })

        .catch(error => {
            console.error("Error al enviar el comentario:", error);
        });
    }

    function fetchData(){
        apiInstance.get(`scholarships/${ opportunityContent.id }/comment/`)
            .then(response => {
                console.log("Comentarios:", response.data);
                setComments(response.data.map((comment: any) => parseComment(comment)));
            })
            .catch(error => {
                console.error("Error al obtener los comentarios:", error);
            });
    }

    useEffect(() => { fetchData() }, []);

    return (
        <div>
            <h1 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Contribuciones</h1>
            { comments.length > 0 ?
                <div>
                    { comments.map((comment : Comment) => (
                        <CommentCard
                            key={ comment.id }
                            comment={ comment }
                            op={opportunityContent.author == comment.author}
                            reloadParent={fetchData}
                        />
                    )) }
                </div>
                : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <b>Aún no hay contribuciones</b>
                        <p>¡Es la oportunidad perfecta para apoyar a la comunidad!</p>
                    </div>
                )
            }
            { authContext.isAuthenticated &&
                <form className="mt-6 w-full grid grid-cols-[75%_25%]">
                    <input
                        type="text"
                        {...register("content", {required: true}) }
                        placeholder="Añadir una contribución..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    /> 
                    <button
                        type="button"
                        onClick={handleSubmit(handleCommentSubmit)}
                        className={`
                            w-full ml-2 flex justify-center gap-2
                            items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white
                            ${isValid
                                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
                                : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            }
                        `}
                    >
                        Enviar
                        <PaperAirplaneIcon className="rotate-90 w-6 h-6"/>
                    </button>
                </form>
            }
        </div>
    )

}