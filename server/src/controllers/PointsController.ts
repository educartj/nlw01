import { Request, Response } from 'express'; 
import knex from '../database/connection';

class PointsController {
  async index(request:Request, response: Response){
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item =>Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');
      console.log(points)

      // select distinct `points`.* from `points`
      //  inner join `point_items` on `points`.`id` = `point_items`.`point_id`
      //  where `point_items`.`item_id` in (NaN) and `city` = 'Descoberto' and `uf` = 'MG'

    return response.json(points);

  }



  async show(request:Request, response: Response){
    const { id } = request.params;
    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'erro'});
    }

    
    // SELECT * FROM items
    //   JOIN point_items ON items id = point_items.item_id
    //   WHERE point_items point_id = {id}

    const items = await knex('items')
    .join('point_items', 'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id);
  
    return response.json({point, items});
  }


  async create(request: Request, response: Response) {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
      } = request.body;
    
      const trx = await knex.transaction();// Se a 2ª await não funcionar a 1 await não completa 
      
      const point = {
        image: 'https://images.unsplash.com/photo-1475275083424-b4ff81625b60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
      };

      const insertedIds = await trx('points').insert(point);
    
      const point_id = insertedIds[0];
    
      const pointItems = items.map((item_id: number) =>{
        return {
          item_id,
          point_id,
        }
      })
    
      await trx('point_items').insert(pointItems);

      await trx.commit();

    // colocar um objeto dentro de outro objeto
      return response.json({
        id: point_id, 
        ...point, 
      });
  }


}

export default PointsController;