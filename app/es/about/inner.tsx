export const metadata = {
  title: 'Sobre nosotros | Korelyy - Centro de herramientas online gratuitas para creadores',
  description:
    'Conoce al equipo de Korelyy y nuestra misión. Seleccionamos más de 900 herramientas gratuitas listas para usar en el navegador, en categorías de IA, imagen, PDF, oficina, desarrollo y creatividad. Disponibles en 6 idiomas en más de 180 países.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sobre Korelyy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Menos descargas. Menos instalaciones. Más trabajo real hecho. Todo en una sola pestaña del navegador.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quiénes somos</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Korelyy es un equipo distribuido de desarrolladores independientes, product managers de IA, traductores
            multilingües y creadores de contenido. Desde nuestro lanzamiento a mediados de 2024, cada funcionalidad
            que publicamos cumple una misión sencilla: <strong>reunir las mejores herramientas nativas de la web bajo
            un mismo techo,</strong> para que nadie tenga que pasar 20 minutos buscando, descargando instaladores
            inflados o cerrando anuncios emergentes solo para redimensionar una imagen.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A junio de 2026, Korelyy cuenta con <strong>más de 900 herramientas gratuitas revisadas manualmente</strong>
            — escritura y generación de imágenes con IA, conversión de PDF / imagen / audio, utilidades de texto,
            ayudas para desarrolladores, productividad ofimática y creatividad. El sitio está totalmente localizado
            en <strong>español, inglés, francés, chino, hindi y árabe</strong>, y lo usan a diario creadores,
            estudiantes y profesionales en más de 180 países y territorios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">En qué creemos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">1. 100 % gratuito, sin ataduras</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Todas las herramientas principales son gratuitas. Sin registro obligatorio, sin número de teléfono,
                sin muros de pago de « mira un anuncio para desbloquear ».
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">2. Privacidad por diseño</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Las imágenes, documentos y medios subidos solo se usan para la tarea en curso y se borran en una hora.
                Nada se reutiliza como datos de entrenamiento de IA.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">3. Revisados a mano. Sin trucos.</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nuestro equipo prueba cada herramienta. Instaladores con basura, botones falsos de « Descargar » y
                redirecciones forzadas no tienen cabida en Korelyy.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">4. Localizados y transparentes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Política de privacidad, aviso legal, ajustes de cookies y canales de contacto en los 6 idiomas,
                en línea con las normativas regionales de protección de datos.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Por qué Korelyy en lugar de un portal de descargas</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            En un sitio de descargas clásico abres 5 pestañas, te instalas 3 barras y acabas igual de frustrado.
            Korelyy solo lista <strong>herramientas que se ejecutan directamente en tu navegador</strong> :
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
            <li>Sin instaladores exe / dmg / apk. <strong>Abre, usa, cierra.</strong> Nada ocupa espacio en tu disco.</li>
            <li>Auténticamente multiplataforma: Windows, macOS, Linux, iOS, Android, tabletas y navegadores minoritarios funcionan igual.</li>
            <li>Ideal para creadores: edición de textos, compresión de imágenes, división de PDF, IA, subtítulos, conversiones de color en un solo lugar.</li>
            <li>Ideal para desarrolladores: probador de regex, formateador JSON, Base64, códigos QR, UUID y convertidores de marca de tiempo a un clic.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contacta con nosotros</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Agradecemos cualquier tipo de comentario: una herramienta rota, un anuncio molesto, una idea, una
            colaboración o una solicitud de retirada. Nuestro pequeño equipo lee cada correo personalmente.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Publicidad y alianzas</div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Soporte, privacidad y retiradas</div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Respondemos a todos los mensajes legítimos en 1 día hábil. Gracias por ayudarnos a mejorar Korelyy.
          </p>
        </section>
      </div>
    </div>
  );
}
