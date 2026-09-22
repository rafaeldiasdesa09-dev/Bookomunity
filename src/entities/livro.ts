export class Livro {
    _id: number;
    _titulo: string;
    _genero: string;
    _foto: string | null;

    constructor(
        id: number,
        titulo: string,
        genero: string,
        foto: string | null = null
    ) {
        this._id = id;
        this._titulo = titulo;
        this._genero = genero;
        this._foto = foto;
    }

    get id(): number {
        return this._id;
    }

    get titulo(): string {
        return this._titulo;
    }

    get genero(): string {
        return this._genero;
    }

    get foto(): string | null {
        return this._foto;
    }

    set titulo(valor: string) {
        if (!valor) {
            throw new Error("Título obrigatório");
        }

        this._titulo = valor.trim();
    }

    set genero(valor: string) {
        if (!valor) {
            throw new Error("Gênero obrigatório");
        }

        this._genero = valor.trim();
    }

    static validar(dados: {
        titulo?: string;
        genero?: string;
    }): string[] {
        const erros: string[] = [];

        if (!dados.titulo || dados.titulo.trim() === "") {
            erros.push("Título obrigatório");
        }

        if (!dados.genero || dados.genero.trim() === "") {
            erros.push("O produto deve estar em um gênero");
        }

        return erros;
    }

    static fromJSON(json: any): Livro {
        return new Livro(
            json.id,
            json.titulo,
            json.genero,
            json.capa
        );
    }

    toJSON(): object {
        return {
            id: this._id,
            titulo: this._titulo,
            genero: this._genero,
            foto: this._foto
        };
    }
}
