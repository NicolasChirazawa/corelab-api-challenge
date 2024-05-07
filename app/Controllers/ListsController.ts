import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import List from "App/Models/List";



export default class ListsController {
    public async create({ request, response }: HttpContextContract) {
        const { title, description, is_favorite } = request.only(["title", "description", "is_favorite"]);

        try{
            const list = await List.create({
                title,
                description,
                color: 0,
                is_favorite,
            });

            return response.status(200).json({message: "Lista criada com sucesso.", list});
        }
        catch(error){
            response.badRequest(error.messages);
        }
    }

    public async getAll(){
        const all = await List.all();
        
        return all;
    }

    public async getById({ request, response }: HttpContextContract){
        const list = await List.find(request.param('id'));
        if(!list){ return response.status(404).json({message: "Lista não encontrada"})}
        return list;
    }
    
    public async searchByTitle({ request, response }: HttpContextContract) {
        
        const title1 = request.param('title')+``;

        try {
            const title = await List.query().where('title', 'LIKE', `%${title1}%`);
            return response.status(200).json({ message: "Listas encontradas", title });

        } catch (error) {
            return response.status(500).json({ message: "Erro ao buscar listas por título", error });
        }
    }

    public async update({ request, response }: HttpContextContract) {
        
        try{
            const list = await List.findOrFail(request.param('id'));

            list.title = request.input('title');
            list.description = request.input('description');
            list.color = request.input('color');
            list.is_favorite = request.input('is_favorite');
            await list.save();

            return response.status(200).json({message: "Lista atualizada com sucesso.", list});
        }
        catch(error){
            response.badRequest(error.messages);
        }
    }

    public async delete({ request, response}: HttpContextContract){

        try{
            const list = await List.findOrFail(request.param('id'));
            await list.delete();

            return response.status(204).json({message: "Apagado com sucesso"})
        }
        catch(error){
            response.status(404).json({message: "Lista não encontrada"})
        }
    }
}