FRANCISCO MOHAMAD.

Aplicación web con Express.js, que utiliza Handlebars para la creación de plantillas y MongoDB para la persistencia de los datos. Incluye funcionalidades para la gestión de productos y carritos, incluidas las operaciones CRUD.

SERVIDOR de Expres Funcionando en el puerto 8082

------------------------------------------------------

RUTAS PARA POSTMAN:
```
PRODUCTS

GET/ ==> http://localhost:8082/api/products
GET/:pid ==> http://localhost:8082/api/products/{id}
POST/ ==> http://localhost:8082/api/products
PUT/:pid ==> http://localhost:8082/api/products/{id}
DELETE:pid ==> http://localhost:8082/api/products/{id}

CART

GET/ ==> http://localhost:8082/api/carts
GET/:cid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c
POST/ ==> http://localhost:8082/api/carts
post/:cid/:pid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c/product/:pid
DELETE/carts/:cid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c
DELETE/carts/:cid/products ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c/products
DELETE/carts/:cid/products/:pid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c/products/:pid
PUT/carts/:cid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c
PUT/carts/:cid/products/:pid ==> http://localhost:8082/api/carts/66bf7dde9400c9b36615b18c/products/:pid

```
------------------------------------------------------
Video Añadiendo un producto al Carrito:

https://github.com/user-attachments/assets/9b0b1a48-25ea-4693-89f8-e2b00e519aa0

