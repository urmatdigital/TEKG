import { Request, Response } from 'express';
import { ParcelService } from '../services/ParcelService';

export class ParcelController {
  private parcelService: ParcelService;

  constructor() {
    this.parcelService = new ParcelService();
  }

  async createParcel(req: Request, res: Response) {
    try {
      const { user_id, description, photo_url, tracking_number } = req.body;

      if (!user_id || !description) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: {
            user_id: !user_id ? 'Required' : undefined,
            description: !description ? 'Required' : undefined
          }
        });
      }

      const result = await this.parcelService.createParcel({
        user_id,
        description,
        photo_url,
        tracking_number
      });

      return res.status(201).json({
        message: 'Parcel created successfully',
        parcel: result.parcel
      });
    } catch (error) {
      console.error('Create parcel error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async updateParcel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, photo_url, tracking_number, status, notes } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Missing parcel ID' });
      }

      const result = await this.parcelService.updateParcel(parseInt(id), {
        description,
        photo_url,
        tracking_number,
        status,
        notes
      });

      return res.status(200).json({
        message: 'Parcel updated successfully',
        parcel: result.parcel
      });
    } catch (error) {
      console.error('Update parcel error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async getParcel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Missing parcel ID' });
      }

      const result = await this.parcelService.getParcelById(parseInt(id));

      return res.status(200).json({
        parcel: result.parcel
      });
    } catch (error) {
      console.error('Get parcel error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async getUserParcels(req: Request, res: Response) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ error: 'Missing user ID' });
      }

      const result = await this.parcelService.getUserParcels(parseInt(user_id));

      return res.status(200).json({
        parcels: result.parcels
      });
    } catch (error) {
      console.error('Get user parcels error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async updateParcelStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!id || !status) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: {
            id: !id ? 'Required' : undefined,
            status: !status ? 'Required' : undefined
          }
        });
      }

      const validStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          error: 'Invalid status',
          details: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      const result = await this.parcelService.updateParcelStatus(
        parseInt(id),
        status.toUpperCase() as any,
        notes
      );

      return res.status(200).json({
        message: 'Parcel status updated successfully',
        parcel: result.parcel
      });
    } catch (error) {
      console.error('Update parcel status error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }

  async getAllParcels(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const result = await this.parcelService.getAllParcels(status as string);

      return res.status(200).json({
        parcels: result.parcels
      });
    } catch (error) {
      console.error('Get all parcels error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }
}
