import { Response, NextFunction } from 'express';
import { ContractService } from './contract.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CreateContractDTO, TerminateContractDTO } from './contract.dto';
import { ApiError } from '@shared/errors/ApiError';

const contractService = new ContractService();

export class ContractController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as CreateContractDTO;
      const contract = await contractService.create(userId, dto);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'تم إنشاء العقد بنجاح',
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllByLandlord(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const contracts = await contractService.getAllByLandlord(userId);

      sendSuccess({
        res,
        message: 'تم جلب العقود بنجاح',
        data: contracts,
        meta: { total: contracts.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyContract(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const contract = await contractService.getMyContract(userId);

      sendSuccess({
        res,
        message: 'تم جلب عقدك بنجاح',
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const contract = await contractService.getById(id, userId);

      sendSuccess({
        res,
        message: 'تم جلب العقد بنجاح',
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  }

  async terminate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const dto = req.body as TerminateContractDTO;
      const contract = await contractService.terminate(id, userId, dto);

      sendSuccess({
        res,
        message: 'تم إنهاء العقد بنجاح',
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  }
}