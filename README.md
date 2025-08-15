# TaskDaily

TaskDaily es una aplicación web moderna para la gestión de tareas diarias, diseñada para ayudarte a organizar tu tiempo, aumentar tu productividad y mantener el control de tus pendientes. Desarrollada con React, TypeScript y Firebase, TaskDaily ofrece una experiencia intuitiva, personalizable y eficiente.

## Características

- **Gestión de tareas**: Crea, edita, elimina y marca tareas como completadas o pendientes.
- **Plantillas reutilizables**: Duplica tareas frecuentes y conviértelas en plantillas para agilizar tu flujo de trabajo.
- **Categorías personalizadas**: Organiza tus tareas por categorías y colores para una mejor visualización.
- **Calendario interactivo**: Visualiza tus tareas por día y navega fácilmente entre fechas.
- **Tareas recurrentes**: Programa tareas que se repiten en días específicos o rangos de fechas.
- **Temporizador integrado**: Cronometra la duración de tus tareas y recibe notificaciones al finalizar.
- **Modo claro/oscuro**: Personaliza la apariencia según tus preferencias.
- **Notificaciones**: Recibe recordatorios y avisos para no olvidar tus tareas importantes.
- **Gestión de usuario**: Registro, inicio de sesión y edición de perfil con autenticación segura.

## Tecnologías utilizadas

- **React** + **TypeScript**: Interfaz moderna, componentes reutilizables y tipado seguro.
- **Firebase**: Autenticación y base de datos en tiempo real.
- **Tailwind CSS**: Estilos rápidos y responsivos.
- **Vite**: Bundler rápido para desarrollo y producción.
- **Lucide Icons**: Iconografía elegante y accesible.

## Instalación

1. Clona el repositorio:
	```sh
	git clone https://github.com/ghrc19/ToDoList.git
	cd taskdaily
	```
2. Instala las dependencias:
	```sh
	npm install
	```
3. Configura tus variables de entorno en `.env.local` (verifica tu configuración de Firebase).
4. Inicia el servidor de desarrollo:
	```sh
	npm run dev
	```

## Estructura del proyecto

- `src/components`: Componentes reutilizables (tareas, categorías, calendario, UI).
- `src/context`: Contextos globales para autenticación, tareas y tema.
- `src/pages`: Vistas principales (Login, Registro, Dashboard, Settings, Categorías).
- `src/utils`: Funciones auxiliares.
- `public`: Recursos estáticos (iconos, sonidos, imágenes).

## Personalización

- Modifica las categorías y colores desde la interfaz.
- Cambia entre modo claro y oscuro en cualquier momento.
- Activa/desactiva notificaciones desde la configuración.

## Licencia

Este proyecto es personal y está bajo licencia MIT.

---
¡Organiza tu día, alcanza tus metas!
