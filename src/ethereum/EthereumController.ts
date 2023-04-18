import { NextFunction, Request, Response, Router } from 'express';
import { EthereumService } from './EthereumService';
import { QueryParamDto } from './QueryParamDto';
import { IController } from 'src/common/interfaces/IController';
import { validationQueryParams } from 'src/common/middlewares/validationQueryParams';
import { IQueryParams } from 'src/common/interfaces/IQueryParams';
import { IBalance } from './IBalance';

export class EthereumController implements IController {
    private readonly ethereumService: EthereumService;
    public readonly router: Router;
    public readonly path: string;

    constructor() {
        this.ethereumService = new EthereumService();
        this.router = Router({ caseSensitive: true, mergeParams: true });
        this.path = '/eth-coins';
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            this.path,
            validationQueryParams(QueryParamDto),
            this.getBalance,
        );
    }

    private getBalance = async (
        { query: { address, network } }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<{ data: IBalance }>> => {
        try {
            const balance = await this.ethereumService.getBalanceByNetwork(<
                IQueryParams
            >{
                address,
                network,
            });

            return res.status(200).send({ data: balance });
        } catch (err) {
            next(err);
        }
    };
}
