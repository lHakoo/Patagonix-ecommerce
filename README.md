# Patagonix Ecommerce

SPA de ecommerce desarrollada para Patagonix Tech, una software factory del sector retail. La plataforma permite a clientes navegar un catálogo, agregar productos al carrito y completar compras, mientras que los administradores gestionan el catálogo y las órdenes desde un panel protegido.

**URL de producción:** https://patagonix-ecommerce-gilt.vercel.app

## Contexto del cliente

El cliente solicitó una solución escalable y basada en servicios administrados (BaaS) para reducir costos de infraestructura y acelerar el time-to-market, con dos tipos de usuarios: clientes que compran productos, y administradores que gestionan catálogo y órdenes.

## Stack técnico

- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS v4 + React Router
- **Backend as a Service:** Firebase (Authentication + Firestore)
- **Almacenamiento de imágenes:** AWS S3 con uploads vía presigned URLs
- **Backend serverless:** Vercel Serverless Functions
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

## Decisiones arquitectónicas

**Context API + useReducer para el carrito:** en lugar de una librería externa de manejo de estado, el carrito usa `useReducer` con un reducer puro y testeable (`cartReducer.ts`), separado del Context en sí. Esto permite testear toda la lógica de negocio del carrito sin necesidad de renderizar componentes de React.

**Presigned URLs para S3:** las credenciales de AWS nunca llegan al navegador. El frontend le pide a una Vercel Serverless Function una URL temporal firmada (expira en 60 segundos), y sube el archivo directo a S3 usando esa URL — el servidor nunca actúa como intermediario del archivo en sí, solo autoriza la subida.

**Reglas de seguridad por rol en Firestore:** los productos son de lectura pública (cualquiera puede ver el catálogo sin sesión) pero de escritura exclusiva para administradores. Las órdenes solo son visibles para su propio dueño, salvo para administradores que pueden ver y modificar todas. Un usuario no puede auto-asignarse el rol de admin editando su propio documento.

**Estructura de carpetas por capas:**
```
src/
  components/   # UI reutilizable
  pages/        # Vistas por ruta (incluye pages/admin para el panel)
  contexts/     # AuthContext, CartContext y sus reducers
  hooks/        # useDebounce
  services/     # Comunicación con Firebase, S3 y APIs
  types/        # Interfaces TypeScript compartidas
  test/         # Setup y utilidades de testing
api/            # Vercel Serverless Functions (presigned-url)
```

## Instalación y configuración

1. Cloná el repositorio e instalá dependencias:
```bash
npm install
```

2. Creá un archivo `.env` en la raíz (usá `.env.example` como referencia) con tus credenciales de Firebase y AWS.

3. Corré el proyecto en desarrollo:
```bash
npm run dev
```

4. Corré los tests:
```bash
npm test
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | API Key del proyecto Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de storage de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID de Firebase Messaging |
| `VITE_FIREBASE_APP_ID` | ID de la app Firebase |
| `AWS_REGION` | Región del bucket S3 (ej. us-east-1) |
| `AWS_ACCESS_KEY_ID` | Access Key del usuario IAM (solo backend) |
| `AWS_SECRET_ACCESS_KEY` | Secret Key del usuario IAM (solo backend) |
| `AWS_S3_BUCKET_NAME` | Nombre del bucket S3 |

Las variables con prefijo `VITE_` son expuestas al frontend por Vite. Las variables de AWS **no** llevan ese prefijo a propósito, para que solo la Serverless Function (backend) pueda leerlas.

## Flujo de upload de imágenes a S3

1. El usuario selecciona un archivo en el formulario de producto (`ProductForm.tsx`).
2. El frontend llama a `POST /api/presigned-url` con el nombre y tipo de archivo.
3. La Serverless Function (`api/presigned-url.ts`) valida el tipo de archivo, genera una clave única con timestamp, y devuelve una URL firmada de S3 que expira en 60 segundos.
4. El frontend sube el archivo directamente a S3 usando esa URL (`PUT`), sin pasar por el backend.
5. La URL pública final se guarda como `imageUrl` del producto en Firestore.

## Testing

Suite de 23 tests cubriendo:
- `cartReducer`: las 4 acciones (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART) y casos límite (cantidad 0/negativa, inmutabilidad)
- `useCart`: hook testeado de forma aislada con `renderHook` y un wrapper de `CartProvider`
- `useAuth`: hook testeado mockeando Firebase Auth y Firestore completos
- Test de integración: flujo completo de agregar un producto al carrito desde `ProductDetail`, con un componente "spy" para verificar el estado del Context desde afuera

## Bitácora de uso de IA

| # | Momento | Cómo ayudó la IA | Qué aprendí / decidí |
|---|---|---|---|
| 1 | Error "Missing or insufficient permissions" en Firestore al probar el registro de usuario | La IA identificó que las reglas de seguridad por defecto de Firestore deniegan todo, y propuso una regla temporal de desarrollo (`allow read, write: if request.auth != null`) | Entendí que Firestore no tiene reglas permisivas por defecto, y que hay que decidir explícitamente qué puede leer/escribir cada tipo de usuario |
| 2 | Diseño de las reglas de seguridad finales por rol | Le pedí a la IA que diseñe reglas que distingan admin de customer. Propuso una función `isAdmin()` que hace un `get()` a Firestore para verificar el rol del lado del servidor, y una regla que impide que un usuario se auto-asigne el rol admin comparando `request.resource.data.role == resource.data.role` | Aprendí que nunca hay que confiar en el rol que viene del cliente sin verificarlo también en las reglas de seguridad del backend |
| 3 | Query de historial de órdenes (`where` + `orderBy` combinados) tiraba error de índice faltante | La IA explicó que Firestore necesita un índice compuesto para queries que combinan `where` y `orderBy` en campos distintos, y guió la creación manual del índice en la consola de Firebase | Entendí la diferencia entre una query simple (no necesita índice) y una compuesta (sí lo necesita), y cómo Firestore expone el link para crearlo automáticamente |
| 4 | Test de `useAuth` fallaba en la aserción de `loading === true` | La IA identificó que el mock de `onAuthStateChanged` resolvía de forma síncrona, por lo que el estado `loading` ya era `false` para cuando se ejecutaba la aserción intermedia — un problema de diseño del test, no del código real | Aprendí a diferenciar un bug en el código de una aserción mal diseñada por asumir un timing que el mock no reproduce |
| 5 | Deploy en Vercel: 404 al refrescar cualquier ruta que no fuera la raíz (`/catalog`, `/admin`, etc.) | La IA explicó que es un problema típico de SPAs: Vercel busca un archivo físico en esa ruta en vez de servir `index.html` y dejar que React Router maneje el ruteo del lado del cliente. Propuso un `vercel.json` con rewrites que excluyen las rutas `/api/*` | Entendí la diferencia entre ruteo del lado del servidor y del cliente, y por qué las Serverless Functions necesitan quedar excluidas del rewrite |
| 6 | Archivos `.tsx`/`.ts` que quedaban vacíos o cortados al pegar código en VS Code, causando errores de "does not provide an export named default" | La IA propuso verificar el contenido real en disco con `type <archivo>` en la terminal (en vez de confiar en lo que mostraba el editor), y cuando el problema persistía, vaciar el archivo por completo antes de re-pegar el contenido | Aprendí una técnica de diagnóstico: cuando el editor y la terminal "no coinciden", conviene verificar el estado real del archivo en disco antes de seguir depurando el código en sí |

## Aprendizajes del proyecto

- Diferenciar validación de permisos en frontend (UX) de validación real en Firestore Rules (seguridad).
- El valor de separar la lógica de negocio (reducers, servicios) de los componentes de React para poder testearla de forma aislada.
- Cómo diagnosticar problemas de infraestructura (índices de Firestore, ruteo de SPA en producción) que no aparecen en desarrollo local.