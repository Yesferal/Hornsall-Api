import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { bandModel } from '../models';

export class BandController extends BaseController {
    public async findAll(
        request: Request, 
        response: Response
    ): Promise<void> {
        try {
            const items = await bandModel.find();
        
            response.status(200).send(items);
        } catch (e) {
            response.status(404).send(e.message);
        }
    }

    public async findById(
        request: Request, 
        response: Response
    ): Promise<void> {
        try {
            const item = await bandModel
                .findById(request.params.id)
                .populate('concerts')
                .exec();
        
            response.status(200).send(item);
        } catch (e) {
            response.status(404).send(e.message);
        }
    }

    public async create(
        request: Request,
        response: Response, 
        next: () => any
    ): Promise<void> {
        try {
            const item = await bandModel
                .create(request.body)

            console.log(item)
            response.json(item)
        } catch (error) {
            return next(error)
        }
    }

    public async upsert(
        request: Request,
        response: Response
    ): Promise<void> {
        try {
            const item = await bandModel
                .findByIdAndUpdate(request.params.id, {
                    $set: request.body,
                }, {
                    new: true, // Return new object instead of the original
                    upsert: true // True value turn this update into an upsert
                }, function (err, model) {
                    console.log(`Error: ${err}`)
                    if (!model) {
                        const e = new Error(`Data with ${request.params._id} not found.`)
                        throw e
                    } else {
                        return model
                    }
                })

            console.log(`item updated: ${item}`)
            console.log(`request.body updated: ${JSON.stringify(request.body)}`);
            response.status(200).send(item)
        } catch (e) {
            response.status(404).send(e.message)
        }
    }
}
