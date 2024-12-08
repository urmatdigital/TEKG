"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TULPAR EXPRESS API')
        .setDescription('API документация для сервиса TULPAR EXPRESS')
        .setVersion('1.0')
        .addTag('Аутентификация', 'Методы для работы с аутентификацией')
        .addTag('МойСклад', 'Методы для работы с API МойСклад')
        .addTag('Пользователи', 'Методы для работы с пользователями')
        .addTag('Рефералы', 'Методы для работы с реферальной системой')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
}
//# sourceMappingURL=swagger.config.js.map