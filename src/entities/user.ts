export class user {
    private _id: number;
    private _nome: string;
    private _email: string;
    private _senha: string;
    private _dataCriacao: string;
    private _foto: string | null;
    private _perms: string; 

    constructor(
        id: number,
        nome: string,
        email: string,
        senha: string,
        dataCriacao: string,
        foto: string | null = null,
        perms: string
    ) {
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._senha = senha;
        this._dataCriacao = dataCriacao;
        this._foto = foto;
        this._perms = perms;
    }

    get id(): number { return this._id }
    get nome(): string { return this._nome }
    get email(): string { return this._email }
    get senha(): string { return this._senha }
    get dataCriacao(): string { return this._dataCriacao }
    get foto(): string | null { return this._foto }
    get perms(): string { return this._perms }

    set nome(valor: string) {
        if (!valor) {
            throw new Error("Título obrigatório");
        }
        this._nome = valor.trim();
    }

    set dataCriacao(valor: string) {
        this._dataCriacao = valor;
    }

    set foto(valor: string | null) {
        this._foto = valor;
    }

    set perms(valor: string) {
        this._perms = valor;
    }

    static validar(dados: { nome?: string, email?: string, senha?: string }) {
        const erros = [];

        if (!dados.nome || dados.nome.trim() == "") {
            erros.push("Insira um nome de exibição");
        }

        if (!dados.email || !dados.email.includes("@")) {
            erros.push("E-mail obrigatório e deve ser escrito corretamente");
        }

        if (!dados.senha || dados.senha.length < 6) {
            erros.push("Senha obrigatória e deve conter no mínimo 6 caracteres");
        }

        return erros;
    }

    static fromJSON(json: any): user {
        return new user(
            json.id,
            json.nome,
            json.email,
            json.senha,
            json.dataCriacao,
            json.foto,
            json.perms
        );
    }

    toJSON(): object {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
            senha: this._senha,
            dataCriacao: this._dataCriacao,
            foto: this._foto,
            perms: this._perms
        };
    }
}
