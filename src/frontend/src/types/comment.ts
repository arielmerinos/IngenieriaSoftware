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

export interface Comment {
    /** Id del comentario */
    id: number;
    /** Usuario que hizo el comentario */
    author: string;
    /** Contenido del comentario */
    content: string;
    /** Fecha de creación del comentario */
    createdAt: Date;
}

export function parseComment(comment: any): Comment {
    return {
        id: comment.id,
        author: comment.user,
        content: comment.content,
        createdAt: new Date(comment.created_at),
    };
}