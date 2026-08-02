package tools;

/**
 *Clase contenedora para las interfaces relacionadas con los kits de habilidades.
 *Esta clase no se instancia directamente; su función es agrupar la interfaz {@link Kit}.
 */
public class Interfaz_kits {
	

	
	/**
	 * Interfaz que define la estructura básica que debe cumplir cualquier kit de habilidades.
	 * <p>
	 * Un kit representa un conjunto de habilidades que un personaje puede usar en el juego.
	 * Esta interfaz permite obtener las habilidades disponibles y controlar el uso de la habilidad 
	 * definitiva (ulti) para que solo pueda activarse una vez por turno o situación.
	 * </p>
	 */
	public interface Kit {
		
		/**
		 * Obtiene todas las habilidades asociadas a este kit.
		 * @return array de {@link Habilidad} que contiene todas las habilidades del kit.
		 */
	    Habilidad[] getHabilidades();
	    
	    /**
	     * Indica si la habilidad definitiva (ulti) ya ha sido utilizada.
	     * @return {@code true} si la Ultimate ya fue usada, {@code false} en caso contrario.
	     */
		boolean isUltiUsada();
		
		/**
		 * Marca la habilidad definitiva (Ultimate) como usada.
		 * <p>
		 * Esto asegura que la ulti no pueda activarse nuevamente durante la partida.
		 * </p>
		 */
		void marcarUltiUsada();
	}
	

}
