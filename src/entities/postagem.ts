export class Postagem {
    private _id: number;
    private _titulo: string;
    private _conteudo: string;
    private _dataCriacao: string;
    private _foto: string | null;
    private _idUsuario: number;
    private _idClube: number;

    constructor(
        id: number,
        titulo: string,
        conteudo: string,
        dataCriacao: string,
        foto: string | null = null,
        idUsuario: number = 0,
        idClube: number = 0
    ) {
        this._id = id;
        this._titulo = titulo.trim();
        this._conteudo = conteudo.trim();
        this._dataCriacao = dataCriacao;
        this._foto = foto;
        this._idUsuario = idUsuario;
        this._idClube = idClube;
    }

    get id(): number {
        return this._id;
    }

    get titulo(): string {
        return this._titulo;
    }

    get conteudo(): string {
        return this._conteudo;
    }

    get dataCriacao(): string {
        return this._dataCriacao;
    }

    get foto(): string | null {
        return this._foto;
    }

    get idUsuario(): number {
        return this._idUsuario;
    }

    get idClube(): number {
        return this._idClube;
    }

    set titulo(valor: string) {
        if (!valor || valor.trim() === "") {
            throw new Error("Título obrigatório");
        }

        this._titulo = valor.trim();
    }

    set conteudo(valor: string) {
        if (!valor || valor.trim() === "") {
            throw new Error("Conteúdo obrigatório");
        }

        this._conteudo = valor.trim();
    }

    set dataCriacao(valor: string) {
        if (!valor || valor.trim() === "") {
            throw new Error("Data de criação obrigatória");
        }

        this._dataCriacao = valor.trim();
    }

    set foto(valor: string | null) {
        this._foto = valor;
    }

    set idUsuario(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new Error("Usuário inválido");
        }

        this._idUsuario = valor;
    }

    set idClube(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new Error("Clube inválido");
        }

        this._idClube = valor;
    }

    static validar(dados: {
        titulo?: string;
        conteudo?: string;
        dataCriacao?: string;
        idUsuario?: number;
        idClube?: number;
    }): string[] {
        const erros: string[] = [];

        if (!dados.titulo || dados.titulo.trim() === "") {
            erros.push("Título obrigatório");
        }

        if (!dados.conteudo || dados.conteudo.trim() === "") {
            erros.push("Conteúdo obrigatório");
        }

        if (!dados.dataCriacao || dados.dataCriacao.trim() === "") {
            erros.push("Data de criação obrigatória");
        }

        if (
            dados.idUsuario !== undefined &&
            (!Number.isInteger(dados.idUsuario) || dados.idUsuario <= 0)
        ) {
            erros.push("Usuário inválido");
        }

        if (
            dados.idClube !== undefined &&
            (!Number.isInteger(dados.idClube) || dados.idClube <= 0)
        ) {
            erros.push("Clube inválido");
        }

        return erros;
    }

    static fromJSON(json: any): Postagem {
        return new Postagem(
            json.id,
            json.titulo,
            json.conteudo,
            json.dataCriacao,
            json.foto ?? null,
            json.idUsuario ?? 0,
            json.idClube ?? 0
        );
    }

    toJSON(): object {
        return {
            id: this._id,
            titulo: this._titulo,
            conteudo: this._conteudo,
            dataCriacao: this._dataCriacao,
            foto: this._foto,
            idUsuario: this._idUsuario,
            idClube: this._idClube
        };
    }
}
