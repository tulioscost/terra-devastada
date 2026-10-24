import {openRollDialog} from "./rolls.mjs";
import {initialConviction} from "./rules.mjs";
const {HandlebarsApplicationMixin}=foundry.applications.api;
const {ActorSheetV2, ItemSheetV2}=foundry.applications.sheets;
const DialogV2=foundry.applications.api.DialogV2;
const ROOT="systems/terra-devastada";

const TRAITS={caracteristicas:"Característica",condicoes:"Condição",trunfos:"Trunfo",dramas:"Drama"};

export class TerraActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS={
    classes:["terra-devastada","td-actor-sheet"],
    position:{width:820,height:790},
    window:{resizable:true},
    form:{submitOnChange:true,closeOnSubmit:false},
    actions:{
      rollAction:TerraActorSheet.rollAction,
      rollReaction:TerraActorSheet.rollReaction,
      rollInitiative:TerraActorSheet.rollInitiative,
      rollHorror:TerraActorSheet.rollHorror,
      addTrait:TerraActorSheet.addTrait,
      removeTrait:TerraActorSheet.removeTrait,
      initialConviction:TerraActorSheet.initialConviction,
      resetScene:TerraActorSheet.resetScene,
      createItem:TerraActorSheet.createItem,
      removeItem:TerraActorSheet.removeItem,
      openItem:TerraActorSheet.openItem,
      openItemsCompendium:TerraActorSheet.openItemsCompendium,
      changePortrait:TerraActorSheet.changePortrait
    }
  };
  static PARTS={main:{template:`${ROOT}/templates/actor.hbs`}};
  _tab="perfil";

  async _prepareContext(options){
    const context=await super._prepareContext(options);
    return {...context,actor:this.actor,system:this.actor.system,
      types:this.actor.type,
      inventory:[...this.actor.items.contents].sort((a,b)=>a.sort-b.sort).map(i=>({id:i.id,name:i.name, img:i.img,categoria:i.system.categoria, quantidade:i.system.quantidade, equipado:i.system.equipado, descricao:i.system.descricao})),
      caracteristicas:this.actor.system.caracteristicas.map((value,index)=>({value,index})),
      trunfos:this.actor.system.trunfos.map((value,index)=>({value,index})),
      dramas:this.actor.system.dramas.map((value,index)=>({value,index})),
      condicoes:this.actor.system.condicoes.map((value,index)=>({value:value.nome, duracao:value.duracao,index})),
      editable:this.isEditable, febreAlerta:this.actor.system.horror>=14,
      maxTracos:12,
      tracosAtual:this.actor.system.caracteristicas.length
    };
  }

  _onRender(context,options){
    super._onRender(context,options);
    const root=this.element;
    if(!root)return;
    const showTab=(which)=>{
      this._tab=which;
      root.querySelectorAll("[data-page]").forEach(x=>{x.hidden=x.dataset.page!==which;});
      root.querySelectorAll("[data-tab-trigger]").forEach(x=>{x.classList.toggle("active",x.dataset.tabTrigger===which);});
    };
    root.querySelectorAll("[data-tab-trigger]").forEach(button=>button.addEventListener("click",()=>showTab(button.dataset.tabTrigger)));
    showTab(this._tab);
    root.querySelectorAll("[data-array-field]").forEach(input=>input.addEventListener("change",async e=>{
      if(!this.isEditable)return;
      const field=e.currentTarget.dataset.arrayField;
      const index=Number(e.currentTarget.dataset.index);
      const prop=e.currentTarget.dataset.prop;
      const rows=foundry.utils.deepClone(this.actor.system[field]);
      if(!Array.isArray(rows)||index<0||index>=rows.length)return;
      if(field==="condicoes")rows[index][prop]=e.currentTarget.value;
      else rows[index]=e.currentTarget.value;
      await this.actor.update({[`system.${field}`]:rows});
    }));
  }

  static async rollAction(){await openRollDialog(this.actor,"acao");}
  static async rollReaction(){await openRollDialog(this.actor,"reacao");}
  static async rollInitiative(){await openRollDialog(this.actor,"iniciativa");}
  static async rollHorror(){await openRollDialog(this.actor,"horror");}

  static async addTrait(event,target){
    if(!this.isEditable)return;
    const field=target.dataset.field;
    if(!TRAITS[field])return;
    const limit=field==="caracteristicas"&&this.actor.system.caracteristicas.length>=12;
    if(limit) ui.notifications.info("O livro sugere 12 Características iniciais. O Mestre pode autorizar mais.");
    const fields=`<label>Nome / descrição<input name="nome" autofocus placeholder="${TRAITS[field]}" /></label>${field==="condicoes"?'<label>Duração<select name="duracao"><option value="curta">Curta</option><option value="media">Média (1d6 horas)</option><option value="longa">Longa</option><option value="indeterminada" selected>Indeterminada</option></select></label>':''}`;
    const data=await DialogV2.input({window:{title:`Adicionar ${TRAITS[field]}`},content:fields,ok:{label:"Adicionar"},rejectClose:false});
    if(!data?.nome?.trim())return;
    const rows=foundry.utils.deepClone(this.actor.system[field]);
    rows.push(field==="condicoes"?{nome:String(data.nome).trim(),duracao:data.duracao||"indeterminada"}:String(data.nome).trim());
    const updates={[`system.${field}`]:rows};
    if(field==="trunfos") {
      updates["system.conviccao"]=this.actor.system.conviccao+6;
      updates["system.horror"]=Math.max(0,this.actor.system.horror-1);
    }
    if(field==="dramas") updates["system.conviccao"]=Math.max(0,this.actor.system.conviccao-3);
    await this.actor.update(updates);
  }

  static async removeTrait(event,target){
    if(!this.isEditable)return;
    const field=target.dataset.field;
    if(!TRAITS[field])return;
    const index=Number(target.dataset.index);
    const rows=foundry.utils.deepClone(this.actor.system[field]);
    if(index<0||index>=rows.length)return;
    rows.splice(index,1);
    await this.actor.update({[`system.${field}`]:rows});
  }

  static async initialConviction(){
    const total=initialConviction(this.actor.system.caracteristicas.length,this.actor.system.trunfos.length);
    if(!this.isEditable)return;
    if(this.actor.system.conviccao>0){
      const answer=await DialogV2.confirm({content:`Substituir Convicção atual (${this.actor.system.conviccao}) por ${total} calculada na criação?`,rejectClose:false});
      if(!answer)return;
    }
    await this.actor.update({"system.conviccao":total});
  }

  static async resetScene(){
    if(!this.isEditable)return;
    await this.actor.update({"system.reacoes":0,"system.bonusConviccaoCena":0});
    ui.notifications.info(`Nova cena iniciada para ${this.actor.name}: reações e bônus de Convicção zerados.`);
  }

  static async createItem(){
    if(!this.isEditable)return;
    const data=await DialogV2.input({window:{title:"Adicionar equipamento"},content:'<label>Nome<input name="nome" autofocus placeholder="Ex.: mochila, revólver, antibióticos"></label><label>Categoria<select name="categoria"><option value="outro">Outro</option><option value="arma">Arma</option><option value="protecao">Proteção</option><option value="medicamento">Medicamento</option><option value="municao">Munição</option><option value="alimento">Alimento</option><option value="ferramenta">Ferramenta</option></select></label>',ok:{label:"Criar"},rejectClose:false});
    if(!data?.nome?.trim())return;
    await this.actor.createEmbeddedDocuments("Item",[{name:data.nome.trim(),type:"equipamento",system:{categoria:data.categoria||"outro"}}]);
  }
  static async removeItem(event,target){
    if(!this.isEditable)return;
    const item=this.actor.items.get(target.dataset.itemId);
    if(item && await DialogV2.confirm({content:`Remover ${item.name} do inventário?`,rejectClose:false}))await item.delete();
  }
  static async openItem(event,target){await this.actor.items.get(target.dataset.itemId)?.sheet.render({force:true});}

  static async openItemsCompendium(){
    const pack=game.packs.get("world.td-itens-45");
    if(!pack){ui.notifications.warn("Instale os compêndios pelo Mestre primeiro.");return;}
    pack.render(true);
  }

  static async changePortrait(){
    if(!this.isEditable)return;
    const Picker=foundry.applications.apps.FilePicker;
    if(!Picker){ui.notifications.warn("Seletor de imagens indisponível.");return;}
    const picker=new Picker({type:"image",current:this.actor.img,callback:async path=>{await this.actor.update({img:path});}});
    await picker.render({force:true});
  }
}

export class TerraItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS={classes:["terra-devastada","td-item-sheet"],position:{width:530,height:550},window:{resizable:true},form:{submitOnChange:true,closeOnSubmit:false}};
  static PARTS={main:{template:`${ROOT}/templates/item.hbs`}};
  async _prepareContext(options){return {...await super._prepareContext(options),item:this.item,system:this.item.system, editable:this.isEditable};}
}
