export class Clube {
    private _id: number;
    private _nome: string;
    private _descricao: string;
    private _dataCriacao: string;
    private _foto: string | null;
    private _idCriador: number;

    constructor(
        id: number,
        nome: string,
        descricao: string,
        dataCriacao: string,
        foto: string | null = null,
        idCriador: number = 0
    ) {
        this._id = id;
        this._nome = nome.trim();
        this._descricao = descricao.trim();
        this._dataCriacao = dataCriacao;
        this._foto = foto;
        this._idCriador = idCriador;
    }

    get id(): number {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get descricao(): string {
        return this._descricao;
    }

    get dataCriacao(): string {
        return this._dataCriacao;
    }

    get foto(): string | null {
        return this._foto;
    }

    get idCriador(): number {
        return this._idCriador;
    }

    set nome(valor: string) {
        if (!valor || valor.trim() === "") {
            throw new Error("Nome obrigatório");
        }

        this._nome = valor.trim();
    }

    set descricao(valor: string) {
        if (!valor || valor.trim() === "") {
            throw new Error("Descrição obrigatória");
        }

        this._descricao = valor.trim();
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

    set idCriador(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new Error("Criador inválido");
        }

        this._idCriador = valor;
    }

    static validar(dados: {
        nome?: string;
        descricao?: string;
        dataCriacao?: string;
        idCriador?: number;
    }): string[] {
        const erros: string[] = [];

        if (!dados.nome || dados.nome.trim() === "") {
            erros.push("Nome obrigatório");
        }

        if (!dados.descricao || dados.descricao.trim() === "") {
            erros.push("Descrição obrigatória");
        }

        if (!dados.dataCriacao || dados.dataCriacao.trim() === "") {
            erros.push("Data de criação obrigatória");
        }

        if (
            dados.idCriador !== undefined &&
            (!Number.isInteger(dados.idCriador) || dados.idCriador <= 0)
        ) {
            erros.push("Criador inválido");
        }

        return erros;
    }

    static fromJSON(json: any): Clube {
        return new Clube(
            json.id,
            json.nome,
            json.descricao,
            json.dataCriacao,
            json.foto ?? null,
            json.idCriador ?? 0
        );
    }

    toJSON(): object {
        return {
            id: this._id,
            nome: this._nome,
            descricao: this._descricao,
            dataCriacao: this._dataCriacao,
            foto: this._foto,
            idCriador: this._idCriador
        };
    }
}
// pfvr funcione agora