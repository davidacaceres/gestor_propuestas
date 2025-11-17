# Gestor de Propuestas

Una aplicación web completa y robusta diseñada para centralizar y optimizar el ciclo de vida completo de la gestión de propuestas comerciales. Desde la creación inicial hasta el archivo final, esta herramienta proporciona un entorno colaborativo e intuitivo para equipos de cualquier tamaño.

## Características Principales

-   **Gestión Integral de Propuestas**: Crea, edita, y gestiona el estado de tus propuestas.
-   **Cartera de Clientes Centralizada**: Administra la información de tus clientes y visualiza su historial de propuestas.
-   **Módulo de Equipo con Control de Roles**: Gestiona a los miembros de tu equipo y asigna permisos detallados.
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

-   **Gestión CRUD Completa**:
    -   Sección dedicada para **crear, listar, editar y eliminar** clientes.
    -   Formulario para registrar nombre de la empresa, contacto, email y teléfono.
    -   **Protección de Datos**: No se puede eliminar un cliente si está asociado a alguna propuesta.
-   **Vista de 360 Grados**:
    -   Al seleccionar un cliente, se accede a una vista de detalle que muestra su información de contacto y una lista completa de todas las propuestas asociadas a él.

### 3. Módulo de Equipo

-   **Gestión CRUD Completa**:
    -   Sección dedicada para **crear, listar, editar y eliminar** miembros del equipo.
    -   **Información Detallada**: Define el nombre, rol, alias (opcional) y correo electrónico.
    -   **Importación Masiva**: Carga rápidamente a todo tu equipo desde un archivo CSV. El formato esperado es `name,role,alias,email` (sin cabecera).
    -   **Protección de Datos**: No se puede eliminar un miembro del equipo si está asignado como líder o participante en alguna propuesta.

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

---

## Roles y Permisos

El sistema cuenta con un control de acceso basado en roles para garantizar la seguridad y la correcta delegación de responsabilidades. Un usuario puede tener múltiples roles para combinar sus permisos.

### 1. Administrador (`Admin`)

Es el rol con el nivel más alto de privilegios. Tiene control total sobre la plataforma.

-   **Visibilidad**: Acceso completo a los módulos de **Propuestas, Clientes y Equipo**.
-   **Permisos de Propuestas**:
    -   Puede **crear, editar y gestionar** cualquier aspecto de todas las propuestas.
-   **Permisos de Clientes**:
    -   Puede **crear, editar y eliminar** cualquier cliente, incluso si tienen propuestas asociadas (con una advertencia de confirmación).
-   **Permisos de Equipo**:
    -   Puede **crear, editar y eliminar** a cualquier miembro del equipo.
    -   **Función clave**: Es el único rol que puede **asignar o modificar los roles** de otros usuarios.
    -   Puede importar miembros desde un archivo CSV.

### 2. Gestor de Proyectos (`ProjectManager`)

Rol diseñado para líderes de proyecto que necesitan gestionar el ciclo de vida de las propuestas y la cartera de clientes, pero no la configuración del sistema.

-   **Visibilidad**: Acceso a los módulos de **Propuestas y Clientes**. No puede ver el módulo de Equipo.
-   **Permisos de Propuestas**:
    -   Puede **crear, editar y gestionar** cualquier aspecto de todas las propuestas (cambiar estado, asignar equipo, etc.).
-   **Permisos de Clientes**:
    -   Puede **crear, editar y eliminar** clientes, con la restricción de no poder borrar aquellos que estén en uso.
-   **Permisos de Equipo**:
    -   No tiene acceso a la gestión de miembros del equipo ni a la asignación de roles.

### 3. Miembro de Equipo (`TeamMember`)

Es el rol base para los colaboradores que trabajan en las propuestas pero no las administran.

-   **Visibilidad**: Acceso restringido únicamente al módulo de **Propuestas**. No puede ver los módulos de Clientes ni Equipo.
-   **Permisos de Propuestas**:
    -   Solo puede ver las propuestas a las que ha sido **asignado** (como líder o miembro).
    -   Dentro de sus propuestas, puede **añadir comentarios** y **subir documentos** (o nuevas versiones).
    -   **No puede** crear nuevas propuestas, cambiar su estado, editar sus detalles principales, ni gestionar el equipo asignado.

La interfaz de la aplicación se adapta dinámicamente: los botones, menús y pestañas de navegación se muestran u ocultan según los roles del usuario que ha iniciado sesión.

---

## Stack Tecnológico

-   **Frontend**: React.js
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS