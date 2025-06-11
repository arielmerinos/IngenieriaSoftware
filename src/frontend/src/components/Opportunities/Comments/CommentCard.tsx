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
import { Comment } from "../../../types/comment"
import { UserIcon, ClockIcon } from '@heroicons/react/outline';

export function CommentCard({ comment }: { comment: Comment }) {

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div>
        <div
            className="
                p-3 mb-4 text-gray-700 dark:text-gray-300
                rounded-xl shadow-md dark:shadow-gray-900">
            <b className="text-sm flex items-center gap-1">
                <UserIcon className="h-4 w-4"/>
                {comment.author}
                <div className="text-xs flex gap-1 w-full justify-end">
                {formatDate(comment.createdAt)}
                <ClockIcon className="h-4 w-4"/>
            </div>
            </b>
            <p className="text-sm mt-2">{comment.content}</p>
        </div>
        </div>
    );
}