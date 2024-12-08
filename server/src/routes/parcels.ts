import { Router } from 'express';
import { ParcelController } from '../controllers/ParcelController';
import { authenticateToken } from '../guards/auth.guard';

const router = Router();
const parcelController = new ParcelController();

// Create a new parcel
router.post('/', authenticateToken, (req, res) => parcelController.createParcel(req, res));

// Update parcel details
router.put('/:id', authenticateToken, (req, res) => parcelController.updateParcel(req, res));

// Get specific parcel
router.get('/:id', authenticateToken, (req, res) => parcelController.getParcel(req, res));

// Get user's parcels
router.get('/user/:user_id', authenticateToken, (req, res) => parcelController.getUserParcels(req, res));

// Update parcel status
router.patch('/:id/status', authenticateToken, (req, res) => parcelController.updateParcelStatus(req, res));

export default router;