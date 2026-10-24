/** Dados Acepção: conceitos narrativos, sem atributos de força/destreza ou pontos de vida. */
const F = foundry.data.fields;
const text = (initial = "") => new F.StringField({ required: true, blank: true, initial });
const integer = (initial = 0) => new F.NumberField({ required: true, integer: true, min: 0, initial });
const list = () => new F.ArrayField(text(), { initial: () => [] });

export class ActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      jogador: text(),
      citacao: text(),
      conceito: text(),
      caracteristicas: list(),
      condicoes: new F.ArrayField(new F.SchemaField({
        nome: text(),
        duracao: new F.StringField({ initial: "indeterminada", choices: ["curta", "media", "longa", "indeterminada"] })
      }), { initial: () => [] }),
      trunfos: list(),
      dramas: list(),
      horror: integer(0),
      conviccao: integer(0),
      bonusConviccaoCena: integer(0),
      historico: text(),
      notas: text(),
      observacoes: text(),
      reacoes: integer(0),
      febreZ: new F.BooleanField({ initial: false })
    };
  }
}

export class ItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      categoria: new F.StringField({ initial: "outro", choices: ["arma", "protecao", "medicamento", "municao", "alimento", "ferramenta", "outro"] }),
      quantidade: new F.NumberField({ initial: 1, integer: true, min: 0 }),
      descricao: text(),
      municao: integer(0),
      capacidade: integer(0),
      equipado: new F.BooleanField({ initial: false }),
      condicao: text(),
      notas: text()
    };
  }
}
