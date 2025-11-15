# Gestor de Propuestas

Una aplicación web completa y robusta diseñada para centralizar y optimizar el ciclo de vida completo de la gestión de propuestas comerciales. Desde la creación inicial hasta el archivo final, esta herramienta proporciona un entorno colaborativo e intuitivo para equipos de cualquier tamaño.

## Características Principales

-   **Gestión Integral de Propuestas**: Crea, edita, y gestiona el estado de tus propuestas.
-   **Cartera de Clientes Centralizada**: Administra la información de tus clientes y visualiza su historial de propuestas.
-   **Módulo de Equipo**: Gestiona de forma centralizada a los miembros de tu equipo y sus roles.
-   **Versionamiento de Documentos**: Sube documentos y mantén un historial completo de cada versión.
-   **Colaboración en Equipo**: Asigna líderes, miembros de equipo, y deja comentarios.
-   **Seguimiento y Notificaciones**: Mantente al día con un centro de notificaciones y un historial de actividad detallado.
-   **Interfaz Moderna y Adaptable**: Diseño limpio, responsivo y con soporte para modo oscuro.

---

## Detalle de Funcionalidades

### 1. Módulo de Propuestas

-   **Creación y Edición**:
    -   Formulario completo para crear propuestas con título, descripción, cliente asociado, fecha límite y una **fecha de alerta personalizable**.
    -   Edición en línea de los detalles de la propuesta (título, descripción, fechas) en estados permitidos.
-   **Gestión de Estado**:
    -   Ciclo de vida completo con estados: `Borrador`, `Enviado`, `Aceptado`, `Rechazado`.
    -   Función de **Archivado** para mantener limpia la lista de propuestas activas.
    -   Confirmaciones para acciones críticas como archivar o desarchivar.
-   **Alertas Visuales**:
    -   Las propuestas cuya fecha actual supera la **fecha de alerta** se resaltan visualmente en la lista para indicar urgencia.
-   **Búsqueda en Archivo**:
    -   Potente barra de búsqueda para encontrar propuestas archivadas por título o cliente, optimizada para un alto rendimiento a largo plazo.

### 2. Módulo de Clientes

-   **Gestión de Clientes**:
    -   Sección dedicada para añadir y listar todos los clientes de la empresa.
    -   Formulario para registrar nombre de la empresa, contacto, email y teléfono.
-   **Vista de 360 Grados**:
    -   Al seleccionar un cliente, se accede a una vista de detalle que muestra su información de contacto y una lista completa de todas las propuestas asociadas a él.

### 3. Módulo de Equipo

-   **Gestión Centralizada**: Una sección dedicada para añadir y listar a todos los miembros del equipo.
-   **Información Detallada**: Define el nombre, rol, alias (opcional) y correo electrónico de cada persona.
-   **Importación Masiva**: Carga rápidamente a todo tu equipo desde un archivo CSV, ahorrando tiempo en la configuración inicial. El formato esperado es `name,role,alias,email` (sin cabecera).

### 4. Colaboración y Seguimiento

-   **Asignación de Roles**:
    -   Asigna un **Líder de Propuesta** como responsable principal. El cambio de líder requiere confirmación.
    -   Añade **miembros del equipo** a cada propuesta y asigna un número de horas de trabajo.
    -   Edita las horas asignadas de forma individual.
-   **Versionamiento de Documentos**:
    -   Sube múltiples documentos a cada propuesta.
    -   Carga nuevas versiones de un documento existente, manteniendo un historial detallado con notas y fecha.
    -   Descarga cualquier versión de un documento desde su historial.
-   **Sección de Comentarios**:
    -   Un espacio de discusión tipo chat dentro de cada propuesta para que el equipo colabore y centralice la comunicación.
-   **Historial de Actividad**:
    -   Una línea de tiempo detallada que registra automáticamente cada cambio importante: creación, cambios de estado, subida de documentos, asignación de equipo y modificaciones de detalles.

### 5. Notificaciones y Experiencia de Usuario

-   **Centro de Notificaciones**:
    -   Un icono de campana en la cabecera alerta sobre nuevos eventos.
    -   Notificaciones automáticas para:
        -   Propuestas que alcanzan su fecha de alerta.
        -   Cambios de estado.
        -   Nuevos documentos o versiones.
    -   Navegación directa desde una notificación a la propuesta correspondiente.
-   **Interfaz Intuitiva**:
    -   Diseño organizado con pestañas en la vista de detalle para no sobrecargar de información (`Documentos`, `Equipo`, `Comentarios`, `Historial`).
    -   **Modo Oscuro** automático que se adapta a las preferencias del sistema operativo.
    -   Componentes reutilizables y una base de código modular para fácil mantenimiento.

## Stack Tecnológico

-   **Frontend**: React.js
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS