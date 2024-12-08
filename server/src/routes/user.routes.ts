import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Пользователи
 *     summary: Получить профиль пользователя
 *     description: Возвращает профиль текущего авторизованного пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Не авторизован
 */
router.get('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented' });
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - Пользователи
 *     summary: Обновить профиль пользователя
 *     description: Обновляет данные профиля текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *       400:
 *         description: Неверные данные запроса
 *       401:
 *         description: Не авторизован
 */
router.put('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented' });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Пользователи
 *     summary: Получить список пользователей
 *     description: Возвращает список всех пользователей (только для администраторов)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                         format: email
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав доступа
 */
router.get('/', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
